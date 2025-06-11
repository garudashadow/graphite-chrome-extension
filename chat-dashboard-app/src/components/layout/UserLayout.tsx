'use client'

import Sidebar from './Sidebar'

interface UserLayoutProps {
  children: React.ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 lg:ml-0 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}

