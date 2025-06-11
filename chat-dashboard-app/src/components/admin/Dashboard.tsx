'use client'

import { useAdminStats } from '@/hooks/useAdminStats'
import UserStats from './UserStats'
import ChatActivity from './ChatActivity'
import { RefreshCw } from 'lucide-react'

export default function Dashboard() {
  const { stats, loading, error, refetch } = useAdminStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600">Kelola dan pantau aktivitas chat real-time</p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error: {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <UserStats 
        stats={stats} 
        loading={loading} 
      />

      {/* Activity Charts */}
      {stats && (
        <ChatActivity
          messagesByHour={stats.messagesByHour}
          topUsers={stats.topUsers}
          loading={loading}
        />
      )}

      {/* Real-time Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Status Real-time</h3>
            <p className="text-sm text-gray-600">
              Dashboard ini diperbarui secara otomatis saat ada aktivitas baru
            </p>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm text-green-600 font-medium">Live</span>
          </div>
        </div>
      </div>
    </div>
  )
}

