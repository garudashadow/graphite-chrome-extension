'use client'

import { Users, MessageSquare, Clock, Hash } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  color: string
  description?: string
}

function StatsCard({ title, value, icon, color, description }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

interface UserStatsProps {
  stats: {
    totalUsers: number
    totalMessages: number
    activeUsers: number
    totalRooms: number
    messagesLast24h: number
  } | null
  loading: boolean
}

export default function UserStats({ stats, loading }: UserStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-gray-200 w-12 h-12"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Gagal memuat statistik</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Pengguna"
        value={stats.totalUsers}
        icon={<Users className="w-6 h-6 text-white" />}
        color="bg-blue-500"
        description="Pengguna terdaftar"
      />
      
      <StatsCard
        title="Total Pesan"
        value={stats.totalMessages.toLocaleString('id-ID')}
        icon={<MessageSquare className="w-6 h-6 text-white" />}
        color="bg-green-500"
        description="Semua pesan"
      />
      
      <StatsCard
        title="Pengguna Aktif"
        value={stats.activeUsers}
        icon={<Clock className="w-6 h-6 text-white" />}
        color="bg-yellow-500"
        description="24 jam terakhir"
      />
      
      <StatsCard
        title="Pesan Hari Ini"
        value={stats.messagesLast24h}
        icon={<Hash className="w-6 h-6 text-white" />}
        color="bg-purple-500"
        description="24 jam terakhir"
      />
    </div>
  )
}

