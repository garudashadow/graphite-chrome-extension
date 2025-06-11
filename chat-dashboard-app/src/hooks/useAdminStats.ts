'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface AdminStats {
  totalUsers: number
  totalMessages: number
  activeUsers: number
  totalRooms: number
  messagesLast24h: number
  topUsers: Array<{
    id: string
    full_name: string | null
    total_messages: number
    last_active: string
  }>
  messagesByHour: Array<{
    hour: string
    count: number
  }>
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch basic counts
      const [
        { count: totalUsers },
        { count: totalMessages },
        { count: totalRooms },
        { data: userStats },
        { data: recentMessages }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('messages').select('*', { count: 'exact', head: true }),
        supabase.from('chat_rooms').select('*', { count: 'exact', head: true }),
        supabase
          .from('user_stats')
          .select(`
            *,
            profiles (id, full_name)
          `)
          .order('total_messages', { ascending: false })
          .limit(5),
        supabase
          .from('messages')
          .select('created_at')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ])

      // Calculate active users (users who sent messages in last 24h)
      const activeUserIds = new Set(
        recentMessages?.map(msg => msg.created_at) || []
      )
      const activeUsers = activeUserIds.size

      // Messages in last 24h
      const messagesLast24h = recentMessages?.length || 0

      // Top users
      const topUsers = userStats?.map(stat => ({
        id: stat.user_id,
        full_name: stat.profiles?.full_name || null,
        total_messages: stat.total_messages,
        last_active: stat.last_active
      })) || []

      // Messages by hour (last 24 hours)
      const messagesByHour = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date(Date.now() - (23 - i) * 60 * 60 * 1000)
        const hourStr = hour.getHours().toString().padStart(2, '0') + ':00'
        
        const count = recentMessages?.filter(msg => {
          const msgHour = new Date(msg.created_at).getHours()
          return msgHour === hour.getHours()
        }).length || 0

        return { hour: hourStr, count }
      })

      setStats({
        totalUsers: totalUsers || 0,
        totalMessages: totalMessages || 0,
        activeUsers,
        totalRooms: totalRooms || 0,
        messagesLast24h,
        topUsers,
        messagesByHour
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()

    // Set up real-time updates
    const channel = supabase
      .channel('admin-stats')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        () => {
          fetchStats()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          fetchStats()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}

