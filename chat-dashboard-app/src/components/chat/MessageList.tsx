'use client'

import { useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Trash2, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface MessageWithProfile {
  id: string
  content: string
  user_id: string
  created_at: string
  profiles: {
    id: string
    full_name: string | null
    avatar_url: string | null
    role: 'admin' | 'user'
  }
}

interface MessageListProps {
  messages: MessageWithProfile[]
  loading: boolean
  onDeleteMessage: (messageId: string) => void
}

export default function MessageList({ messages, loading, onDeleteMessage }: MessageListProps) {
  const { user, isAdmin } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <p>Belum ada pesan. Mulai percakapan!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isOwnMessage = message.user_id === user?.id
        const canDelete = isOwnMessage || isAdmin

        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                isOwnMessage
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {!isOwnMessage && (
                    <div className="flex items-center mb-1">
                      <span className="text-xs font-medium opacity-75">
                        {message.profiles.full_name || 'Anonymous'}
                      </span>
                      {message.profiles.role === 'admin' && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded">
                          Admin
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                  <p className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {format(new Date(message.created_at), 'HH:mm', { locale: id })}
                  </p>
                </div>
                {canDelete && (
                  <button
                    onClick={() => onDeleteMessage(message.id)}
                    className={`ml-2 p-1 rounded hover:bg-opacity-20 ${
                      isOwnMessage 
                        ? 'hover:bg-white text-blue-100 hover:text-white' 
                        : 'hover:bg-gray-300 text-gray-400 hover:text-gray-600'
                    }`}
                    title="Hapus pesan"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}

