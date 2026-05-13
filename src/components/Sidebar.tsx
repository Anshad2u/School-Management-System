'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useSidebar } from '@/contexts/SidebarContext'
import { Home, Users, GraduationCap, BookOpen, UserPlus, CreditCard, Briefcase, BarChart, LogIn, LogOut, FileText, Bell, UserCircle, Film, Clipboard, Settings, DollarSign, TrendingUp, Award, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserPen } from 'lucide-react'

interface SidebarProps {
  onClose?: () => void
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const { user, userRole, signOut } = useAuth()
  const { collapsed, toggleCollapsed } = useSidebar()

  // Admin has all permissions
  const canAccessStaffPages = ['staff', 'principal', 'teacher', 'admin'].includes(userRole)
  const canAccessAdminPages = ['staff', 'principal', 'admin'].includes(userRole)
  const canAccessPrincipalPages = userRole === 'principal' || userRole === 'admin'

  return (
    <div className={`bg-gray-100 h-full flex flex-col transition-all duration-200 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-8 p-4">
        {!collapsed && <h1 className="text-lg sm:text-xl font-bold">Gem Stone Salafi School</h1>}
        <div className="flex items-center gap-1">
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
              <X size={18} />
            </Button>
          )}
          {!onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleCollapsed}
              className="hidden lg:flex"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
          )}
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-2">
        <ul className="space-y-1 sm:space-y-2">
          <li>
            <Link href="/" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
              <Home size={18} className="sm:size-5" />
              {!collapsed && <span>Dashboard</span>}
            </Link>
          </li>
          {user && (
            <>
              {canAccessStaffPages && (
                <>
                  <li>
                    <Link href="/students" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <Users size={18} className="sm:size-5" />
                      {!collapsed && <span>Students</span>}
                    </Link>
                  </li>
                  <li>
                    <Link href="/teachers" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <GraduationCap size={18} className="sm:size-5" />
                      {!collapsed && <span>Teachers</span>}
                    </Link>
                  </li>
                  <li>
                    <Link href="/courses" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <BookOpen size={18} className="sm:size-5" />
                      {!collapsed && <span>Courses</span>}
                    </Link>
                  </li>
                </>
              )}
              {canAccessAdminPages && (
                <>
                  <li>
                    <Link href="/admissions" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <UserPlus size={18} className="sm:size-5" />
                      {!collapsed && <span>Admissions</span>}
                    </Link>
                  </li>
                  <li>
                    <Link href="/fees" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <CreditCard size={18} className="sm:size-5" />
                      {!collapsed && <span>Fees</span>}
                    </Link>
                  </li>
                  <li>
                    <Link href="/staff" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <Briefcase size={18} className="sm:size-5" />
                      {!collapsed && <span>Staff</span>}
                    </Link>
                  </li>
                  <li>
                    <Link href="/analytics" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <BarChart size={18} className="sm:size-5" />
                      {!collapsed && <span>Analytics</span>}
                    </Link>
                  </li>
                </>
              )}
              {canAccessPrincipalPages && (
                <>
                  <li>
                    <Link href="/school-settings" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <Settings size={18} className="sm:size-5" />
                      {!collapsed && <span>School Settings</span>}
                    </Link>
                  </li>
                  <li>
                    <Link href="/financial-management" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <DollarSign size={18} className="sm:size-5" />
                      {!collapsed && <span>Financial Mgmt</span>}
                    </Link>
                  </li>
                  <li>
                    <Link href="/performance-evaluation" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                      <TrendingUp size={18} className="sm:size-5" />
                      {!collapsed && <span>Performance</span>}
                    </Link>
                  </li>
                </>
              )}
              {userRole === 'teacher' && (
                <li>
                  <Link href="/grade-book" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                    <Clipboard size={18} className="sm:size-5" />
                    {!collapsed && <span>Grade Book</span>}
                  </Link>
                </li>
              )}
              {userRole === 'student' && (
                <li>
                  <Link href="/teacher-qualifications" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                    <Award size={18} className="sm:size-5" />
                    {!collapsed && <span>Teacher Quals</span>}
                  </Link>
                </li>
              )}
              <li>
                <Link href={user ? `/profile/${user.id}` : '/login'} className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                  <UserCircle size={18} className="sm:size-5" />
                  {!collapsed && <span>Profile</span>}
                </Link>
              </li>
              <li>
                <Link href="/stories" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                  <Film size={18} className="sm:size-5" />
                  {!collapsed && <span>Stories</span>}
                </Link>
              </li>
              <li>
                <Link href="/resources" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                  <FileText size={18} className="sm:size-5" />
                  {!collapsed && <span>Resources</span>}
                </Link>
              </li>
              <li>
                <Link href="/announcements" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                  <Bell size={18} className="sm:size-5" />
                  {!collapsed && <span>Announcements</span>}
                </Link>
              </li>
            </>
          )}
          {!user ? (
            <>
            <li>
              <Link href="/login" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
                <LogIn size={18} className="sm:size-5" />
                {!collapsed && <span>Login</span>}
              </Link>
            </li>
             <li>
             <Link href="/signup" className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded text-sm sm:text-base">
               <UserPen size={18} className="sm:size-5" />
               {!collapsed && <span>Sign Up</span>}
             </Link>
           </li>
           </>
          ) : (
            <li>
              <button onClick={signOut} className="flex items-center space-x-2 p-2 hover:bg-gray-200 rounded w-full text-sm sm:text-base">
                <LogOut size={18} className="sm:size-5" />
                {!collapsed && <span>Logout</span>}
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar