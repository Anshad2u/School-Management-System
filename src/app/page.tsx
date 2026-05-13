'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, GraduationCap, BookOpen, CreditCard } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const { user, userRole } = useAuth()
  const [stats, setStats] = useState({
    studentCount: 0,
    teacherCount: 0,
    courseCount: 0,
    feeCollection: 0,
  })

  useEffect(() => { 
    if (['staff', 'principal', 'admin'].includes(userRole || '')) {
      fetchStats()
    }
  }, [userRole])

  const fetchStats = async () => {
    const { data: studentCount } = await supabase
      .from('profiles')
      .select('id', { count: 'exact' })
      .eq('role', 'student')

    const { data: teacherCount } = await supabase
      .from('teachers')
      .select('id', { count: 'exact' })

    const { data: courseCount } = await supabase
      .from('courses')
      .select('id', { count: 'exact' })

    const { data: feeCollection } = await supabase
      .from('fees')
      .select('amount')

    setStats({
      studentCount: studentCount?.length || 0,
      teacherCount: teacherCount?.length || 0,
      courseCount: courseCount?.length || 0,
      feeCollection: feeCollection ? feeCollection.reduce((sum, fee) => sum + Number(fee.amount || 0), 0) : 0,
    })
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome to Gem Stone Salafi School</h1>
        <p className="text-gray-600 max-w-sm">Islamic education for children ages 6-14. Please log in to access the dashboard.</p>
        <div className="flex gap-3">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline">Sign Up</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold">Gem Stone Salafi School Dashboard</h1>
      {['staff', 'principal', 'admin'].includes(userRole || '') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students (6-14 yrs)</CardTitle>
              <Users size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.studentCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teachers</CardTitle>
              <GraduationCap size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.teacherCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subjects</CardTitle>
              <BookOpen size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.courseCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fee Collection</CardTitle>
              <CreditCard size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.feeCollection.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {['staff', 'principal', 'admin'].includes(userRole || '') && (
              <>
                <Link href="/admissions">
                  <Button className="w-full">New Admission</Button>
                </Link>
                <Link href="/fees">
                  <Button className="w-full">Manage Fees</Button>
                </Link>
              </>
            )}
            <Link href="/courses">
              <Button className="w-full">View Subjects</Button>
            </Link>
            <Link href="/stories">
              <Button className="w-full">School Stories</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Islamic Education Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>📖 Quran Recitation with Tajweed</li>
              <li>🕌 Authentic Hadith Studies</li>
              <li>🕌 Islamic Studies & Character</li>
              <li>🕌 Arabic Language for Understanding</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}