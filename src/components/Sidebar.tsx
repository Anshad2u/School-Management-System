'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Home, Users, GraduationCap, BookOpen, UserPlus, CreditCard, Briefcase, BarChart, LogIn, LogOut, FileText, Bell, UserCircle, Film, Clipboard, Settings, DollarSign, TrendingUp, Award, X } from 'lucide-react'
import { Button } from '@/components/ui/button'


import { UserPen } from 'lucide-react';

interface SidebarProps {
  onClose?: () => void
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const { user, userRole, signOut } = useAuth()

  return (
    <div className="w-64 bg-gray-100 h-full p-4 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl sm:text-2xl font-bold">School Manager</h1>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X size={20} />
          </Button>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 sm:space-y-2">
          <li>
            <Link href="/" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
              <Home size={18} className="sm:size-5" />
              <span>Dashboard</span>
            </Link>
          </li>
          {user && (
            <>
              {(userRole === 'staff' || userRole === 'principal' || userRole === 'teacher') && (
                <>
                  <li>
                    <Link href="/students" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <Users size={18} className="sm:size-5" />
                      <span>Students</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/teachers" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <GraduationCap size={18} className="sm:size-5" />
                      <span>Teachers</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/courses" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <BookOpen size={18} className="sm:size-5" />
                      <span>Courses</span>
                    </Link>
                  </li>
                </>
              )}
              {(userRole === 'staff' || userRole === 'principal') && (
                <>
                  <li>
                    <Link href="/admissions" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <UserPlus size={18} className="sm:size-5" />
                      <span>Admissions</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/fees" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <CreditCard size={18} className="sm:size-5" />
                      <span>Fees</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/staff" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <Briefcase size={18} className="sm:size-5" />
                      <span>Staff</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/analytics" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <BarChart size={18} className="sm:size-5" />
                      <span>Analytics</span>
                    </Link>
                  </li>
                </>
              )}
              {userRole === 'principal' && (
                <>
                  <li>
                    <Link href="/school-settings" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <Settings size={18} className="sm:size-5" />
                      <span>School Settings</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/financial-management" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <DollarSign size={18} className="sm:size-5" />
                      <span>Financial Mgmt</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/performance-evaluation" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <TrendingUp size={18} className="sm:size-5" />
                      <span>Performance</span>
                    </Link>
                  </li>
                </>
              )}
              {userRole === 'teacher' && (
                <li>
                  <Link href="/grade-book" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                    <Clipboard size={18} className="sm:size-5" />
                    <span>Grade Book</span>
                  </Link>
                </li>
              )}
              {userRole === 'student' && (
                <li>
                  <Link href="/teacher-qualifications" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                    <Award size={18} className="sm:size-5" />
                    <span>Teacher Quals</span>
                  </Link>
                </li>
              )}
              <li>
                <Link href={`/profile/${user?.id}`} className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                  <UserCircle size={18} className="sm:size-5" />
                  <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link href="/stories" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                  <Film size={18} className="sm:size-5" />
                  <span>Stories</span>
                </Link>
              </li>
              <li>
                <Link href="/resources" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                  <FileText size={18} className="sm:size-5" />
                  <span>Resources</span>
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                  <Bell size={18} className="sm:size-5" />
                  <span>Announcements</span>
                </Link>
              </li>
            </>
          )}
          {!user ? (
            <>
            <li>
              <Link href="/login" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                <LogIn size={18} className="sm:size-5" />
                <span>Login</span>
              </Link>
            </li>
             <li>
             <Link href="/signup" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
               <UserPen size={18} className="sm:size-5" />
               <span>Sign Up</span>
             </Link>
           </li>
           </>
          ) : (
            <li>
              <button onClick={signOut} className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded w-full text-sm sm:text-base">
                <LogOut size={18} className="sm:size-5" />
                <span>Logout</span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar