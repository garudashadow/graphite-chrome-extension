'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useMessages } from '@/hooks/useMessages'
import { ChatRoom as ChatRoomType } from '@/types/database'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import { MessageCircle, Users } from 'lucide-react'

interface ChatRoomProps {
  chatRoomId?: string
}

export default function ChatRoom({ chatRoomId }: ChatRoomProps) {
  const [currentRoom, setCurrentRoom] = useState<ChatRoomType | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<number>(0)
  const [roomLoading, setRoomLoading] = useState(true)

  // Use default room if no chatRoomId provided
  const [defaultRoomId, setDefaultRoomId] = useState<string | null>(null)
  const activeRoomId = chatRoomId || defaultRoomId

  const {
    messages,
    loading: messagesLoading,
    error,
    sendMessage,
    deleteMessage,
  } = useMessages(activeRoomId || '')

  // Fetch default room or specific room
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setRoomLoading(true)
        let query = supabase.from('chat_rooms').select('*')
        
        if (chatRoomId) {
          query = query.eq('id', chatRoomId)
        } else {
          query = query.eq('name', 'General')
        }

        const { data, error } = await query.single()

        if (error) {
          console.error('Error fetching room:', error)
          return
        }

        setCurrentRoom(data)
        if (!chatRoomId) {
          setDefaultRoomId(data.id)
        }
      } catch (err) {
        console.error('Error fetching room:', err)
      } finally {
        setRoomLoading(false)
      }
    }

    fetchRoom()
  }, [chatRoomId])

  // Track online users (simplified version)
  useEffect(() => {
    if (!activeRoomId) return

    const channel = supabase.channel(`room:${activeRoomId}`)
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        setOnlineUsers(Object.keys(state).length)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            online_at: new Date().toISOString(),
          })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeRoomId])

  if (roomLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!currentRoom || !activeRoomId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Room tidak ditemukan</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {currentRoom.name}
            </h1>
            {currentRoom.description && (
              <p className="text-sm text-gray-600">{currentRoom.description}</p>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-1" />
            <span>{onlineUsers} online</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <MessageList
        messages={messages}
        loading={messagesLoading}
        onDeleteMessage={deleteMessage}
      />

      {/* Message Input */}
      <MessageInput
        onSendMessage={sendMessage}
        disabled={messagesLoading}
      />
    </div>
  )
}

