'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  MessageCircle, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield,
  Building2
} from 'lucide-react'

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { profile, signOut, isAdmin } = useAuth()
  const pathname = usePathname()

  const userNavigation = [
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Perusahaan', href: '/companies', icon: Building2 },
  ]

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
    { name: 'Chat', href: '/chat', icon: MessageCircle },
    { name: 'Perusahaan', href: '/companies', icon: Building2 },
    { name: 'Pengguna', href: '/admin/users', icon: Users },
    { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
  ]

  const navigation = isAdmin ? adminNavigation : userNavigation

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white p-2 rounded-lg shadow-md"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        ${className}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center px-6 py-4 border-b">
            <MessageCircle className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">ChatApp</h1>
              {isAdmin && (
                <div className="flex items-center mt-1">
                  <Shield className="w-3 h-3 text-red-500 mr-1" />
                  <span className="text-xs text-red-500 font-medium">Admin</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User Profile & Logout */}
          <div className="border-t px-4 py-4">
            <div className="flex items-center px-3 py-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium text-blue-600">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {profile?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
