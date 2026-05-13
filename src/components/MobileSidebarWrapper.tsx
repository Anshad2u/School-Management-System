'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { useSidebar } from '@/contexts/SidebarContext'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface MobileSidebarWrapperProps {
  children: React.ReactNode
}

export default function MobileSidebarWrapper({ children }: MobileSidebarWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { collapsed } = useSidebar()

  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 bg-gray-100 h-full transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
          <h1 className="text-lg font-bold">Salafi School</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}