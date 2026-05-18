'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import ProtectedRoute from '@/components/ProtectedRoute'

type Teacher = {
  id: string
  name: string
  subject: string
  qualification?: string
  experience?: number
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [qualification, setQualification] = useState('')
  const [experience, setExperience] = useState('')
  const [loading, setLoading] = useState(true)
  const { userRole } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('teachers').select('*').order('name')
      if (error) throw error
      setTeachers(data || [])
    } catch (error) {
      console.error('Error fetching teachers:', error)
      toast({ title: "Error", description: "Could not load teachers", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.from('teachers').insert({
        name,
        subject,
        qualification: qualification || null,
        experience: parseInt(experience) || 0
      })
      if (error) throw error
      toast({ title: "Success", description: "Teacher added successfully" })
      fetchTeachers()
      setName('')
      setSubject('')
      setQualification('')
      setExperience('')
    } catch (error) {
      console.error('Error adding teacher:', error)
      toast({ title: "Error", description: "Failed to add teacher", variant: "destructive" })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!userRole || !['staff', 'principal', 'admin', 'teacher'].includes(userRole)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-600">You need to be staff or teacher to access this page.</p>
      </div>
    )
  }

  return (
    <ProtectedRoute>
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold">Salafi School - Teachers</h1>
      
      {/* Add Teacher Form - visible to staff, principal, admin */}
      {['staff', 'principal', 'admin'].includes(userRole) && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Teacher</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Teacher Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sarafraz" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Quran Recitation" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input id="qualification" value={qualification} onChange={(e) => setQualification(e.target.value)} placeholder="e.g. B.A. Islamic Studies" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Input id="experience" type="number" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 5" className="h-11" />
                </div>
              </div>
              <Button type="submit" className="w-full h-11">Add Teacher</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Teachers List */}
      <Card>
        <CardHeader>
          <CardTitle>Teachers ({teachers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {teachers.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No teachers found. Add one above!</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Qualification</TableHead>
                    <TableHead>Experience</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">{teacher.name}</TableCell>
                      <TableCell>{teacher.subject}</TableCell>
                      <TableCell>{teacher.qualification || '-'}</TableCell>
                      <TableCell>{teacher.experience || 0} years</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </ProtectedRoute>
  )
}