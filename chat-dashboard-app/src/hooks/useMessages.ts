'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Message, Profile } from '@/types/database'
import { useAuth } from '@/contexts/AuthContext'

interface MessageWithProfile extends Message {
  profiles: Profile
}

export function useMessages(chatRoomId: string) {
  const [messages, setMessages] = useState<MessageWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles (*)
        `)
        .eq('chat_room_id', chatRoomId)
        .order('created_at', { ascending: true })
        .limit(50)

      if (error) throw error

      setMessages(data as MessageWithProfile[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching messages')
    } finally {
      setLoading(false)
    }
  }, [chatRoomId])

  // Send new message
  const sendMessage = useCallback(async (content: string) => {
    if (!user || !content.trim()) return

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          content: content.trim(),
          user_id: user.id,
          chat_room_id: chatRoomId,
        })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending message')
      throw err
    }
  }, [user, chatRoomId])

  // Delete message
  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting message')
      throw err
    }
  }, [])

  // Subscribe to real-time updates
  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel(`messages:${chatRoomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        async (payload) => {
          // Fetch the complete message with profile data
          const { data, error } = await supabase
            .from('messages')
            .select(`
              *,
              profiles (*)
            `)
            .eq('id', payload.new.id)
            .single()

          if (!error && data) {
            setMessages(prev => [...prev, data as MessageWithProfile])
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        (payload) => {
          setMessages(prev => prev.filter(msg => msg.id !== payload.old.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatRoomId, fetchMessages])

  return {
    messages,
    loading,
    error,
    sendMessage,
    deleteMessage,
    refetch: fetchMessages,
  }
}

