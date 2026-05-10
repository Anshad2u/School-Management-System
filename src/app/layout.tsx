'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import { Geist, Azeret_Mono as Geist_Mono } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'


const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'School Management App',
  description: 'Manage your school with ease',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
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
              fixed inset-y-0 left-0 z-30 w-64 bg-gray-100 h-full transform transition-transform duration-200 ease-in-out
              lg:translate-x-0 lg:static lg:w-64
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </aside>

            {/* Main content */}
            <div className="flex flex-col flex-1 min-w-0">
              {/* Mobile header */}
              <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
                <h1 className="text-lg font-bold">School Manager</h1>
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
            <Toaster/>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}