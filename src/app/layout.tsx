import type { Metadata } from 'next'
import { Geist, Azeret_Mono as Geist_Mono } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import MobileSidebarWrapper from '@/components/MobileSidebarWrapper'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Gem Stone Salafi School',
  description: 'Manage your school with ease',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <SidebarProvider>
            <MobileSidebarWrapper>
              {children}
            </MobileSidebarWrapper>
          </SidebarProvider>
          <Toaster/>
        </AuthProvider>
      </body>
    </html>
  )
}