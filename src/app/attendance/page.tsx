'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ProtectedRoute from '@/components/ProtectedRoute'

interface Student {
  id: string
  name: string
  grade: string
}

interface AttendanceRecord {
  id: string
  student_id: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  notes: string | null
}

export default function AttendancePage() {
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    if (students.length > 0) {
      fetchAttendanceForDate(selectedDate)
    }
  }, [selectedDate, students])

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('id, name, grade')
      .eq('status', 'active')
      .order('name')
    
    if (error) {
      console.error('Error fetching students:', error)
      return
    }
    setStudents(data || [])
  }

  const fetchAttendanceForDate = async (date: Date) => {
    setIsLoading(true)
    const dateStr = date.toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('attendance')
      .select('student_id, status')
      .eq('date', dateStr)
    
    if (error) {
      console.error('Error fetching attendance:', error)
      setIsLoading(false)
      return
    }

    const attendanceMap: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {}
    data?.forEach((record: AttendanceRecord) => {
      attendanceMap[record.student_id] = record.status
    })
    
    // Default to present if no record exists
    students.forEach(student => {
      if (!attendanceMap[student.id]) {
        attendanceMap[student.id] = 'present'
      }
    })
    
    setAttendance(attendanceMap)
    setIsLoading(false)
  }

  const updateAttendance = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendance(prev => ({ ...prev, [studentId]: status }))
  }

  const saveAttendance = async () => {
    setIsSaving(true)
    const dateStr = selectedDate.toISOString().split('T')[0]
    
    try {
      const records = Object.entries(attendance).map(([studentId, status]) => ({
        student_id: studentId,
        date: dateStr,
        status
      }))

      // Upsert attendance records
      const { error } = await supabase
        .from('attendance')
        .upsert(records, { 
          onConflict: 'student_id,date',
          ignoreDuplicates: false 
        })

      if (error) throw error

      toast({
        title: "Success",
        description: `Attendance saved for ${students.length} students`,
      })
    } catch (error) {
      console.error('Error saving attendance:', error)
      toast({
        title: "Error",
        description: "Failed to save attendance",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500'
      case 'absent': return 'bg-red-500'
      case 'late': return 'bg-yellow-500'
      case 'excused': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getFilteredStudents = () => {
    if (filter === 'all') return students
    return students.filter(s => s.grade === filter)
  }

  const grades = [...new Set(students.map(s => s.grade))].sort()

  const summary = () => {
    const counts = { present: 0, absent: 0, late: 0, excused: 0 }
    Object.values(attendance).forEach(status => {
      counts[status]++
    })
    return counts
  }

  const counts = summary()

  return (
    <ProtectedRoute>
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Attendance</h1>
        <Button 
          onClick={saveAttendance} 
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? 'Saving...' : 'Save Attendance'}
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{counts.present}</div>
            <div className="text-sm text-muted-foreground">Present</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">{counts.absent}</div>
            <div className="text-sm text-muted-foreground">Absent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{counts.late}</div>
            <div className="text-sm text-muted-foreground">Late</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{counts.excused}</div>
            <div className="text-sm text-muted-foreground">Excused</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-full p-2 border rounded-md"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Student Attendance</CardTitle>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {grades.map(grade => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="space-y-2">
                {getFilteredStudents().map(student => (
                  <div 
                    key={student.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">Grade {student.grade}</div>
                    </div>
                    <div className="flex gap-2">
                      {(['present', 'absent', 'late', 'excused'] as const).map(status => (
                        <button
                          key={status}
                          onClick={() => updateAttendance(student.id, status)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            attendance[student.id] === status
                              ? `${getStatusColor(status)} text-white`
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </ProtectedRoute>
  )
}
