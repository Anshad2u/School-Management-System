'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

type Course = {
  id: string
  name: string
  description?: string
  created_at: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const { userRole } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('courses').select('*').order('name')
      if (error) throw error
      setCourses(data || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast({
        title: "Error",
        description: "Could not load courses",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('courses').insert({
        name,
        description: ''
      })
      if (error) throw error
      toast({ title: "Success", description: "Course added successfully" })
      fetchCourses()
      setName('')
    } catch (error) {
      console.error('Error adding course:', error)
      toast({
        title: "Error",
        description: "Could not add course",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Courses</h1>
        {['staff', 'principal', 'admin'].includes(userRole || '') && (
          <Button onClick={() => document.getElementById('add-course-form')?.classList.toggle('hidden')}>
            Add Course
          </Button>
        )}
      </div>

      {['staff', 'principal', 'admin'].includes(userRole || '') && (
        <Card id="add-course-form" className="hidden">
          <CardHeader>
            <CardTitle>Add New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Course Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="h-11" />
              </div>
              <Button type="submit" className="h-11">Add Course</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>)}
            </div>
          ) : courses.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No courses found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.description || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}