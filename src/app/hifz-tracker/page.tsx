'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const MODE_OPTIONS = [
  { value: 'quran', label: 'Quran Hifz' },
  { value: 'mutoon', label: 'Mutoon Hifz' }
]

const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Not started' },
  { value: 'learning', label: 'Learning' },
  { value: 'memorized', label: 'Memorized' },
  { value: 'reviewed', label: 'Reviewed' }
]

type Student = {
  id: string
  name: string
  grade: string
  status?: string
}

type HifzRecord = {
  id: string
  student_id: string
  mode: 'quran' | 'mutoon'
  tracker_item: string
  status: 'not_started' | 'learning' | 'memorized' | 'reviewed'
  grade: number | null
  date: string
  notes: string | null
  recorded_by: string | null
  created_at: string
}

type HifzMutoon = {
  id: string
  name: string
  description: string | null
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'memorized':
      return 'bg-green-500 text-white'
    case 'learning':
      return 'bg-yellow-500 text-black'
    case 'reviewed':
      return 'bg-blue-500 text-white'
    case 'not_started':
    default:
      return 'bg-gray-300 text-gray-800'
  }
}

const formatDate = (value: string) => new Date(value).toLocaleDateString()

export default function HifzTrackerPage() {
  const { userRole, user } = useAuth()
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [records, setRecords] = useState<HifzRecord[]>([])
  const [mutoonList, setMutoonList] = useState<HifzMutoon[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [selectedMode, setSelectedMode] = useState<'quran' | 'mutoon'>('quran')
  const [quranTrackerItem, setQuranTrackerItem] = useState('')
  const [selectedMutoon, setSelectedMutoon] = useState('')
  const [newMutoonName, setNewMutoonName] = useState('')
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split('T')[0])
  const [status, setStatus] = useState<'not_started' | 'learning' | 'memorized' | 'reviewed'>('memorized')
  const [grade, setGrade] = useState<number>(100)
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isAddingMutoon, setIsAddingMutoon] = useState(false)

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (selectedMode === 'mutoon' && mutoonList.length > 0 && !selectedMutoon) {
      setSelectedMutoon(mutoonList[0].name)
    }
  }, [selectedMode, mutoonList, selectedMutoon])

  useEffect(() => {
    if (!selectedStudentId && students.length > 0) {
      setSelectedStudentId(students[0].id)
    }
  }, [students, selectedStudentId])

  const fetchInitialData = async () => {
    setIsLoading(true)
    await Promise.all([fetchStudents(), fetchMutoonList(), fetchRecords()])
    setIsLoading(false)
  }

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('id, name, grade, status')
      .eq('status', 'active')
      .order('name')

    if (error) {
      console.error('Error fetching students:', error)
      toast({ title: 'Error', description: 'Unable to load students.', variant: 'destructive' })
      return
    }

    setStudents(data || [])
  }

  const fetchMutoonList = async () => {
    const { data, error } = await supabase
      .from('hifz_mutoon')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching mutoon list:', error)
      toast({ title: 'Error', description: 'Unable to load mutoon list.', variant: 'destructive' })
      return
    }

    setMutoonList(data || [])
  }

  const fetchRecords = async () => {
    const { data, error } = await supabase
      .from('hifz_records')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching tracker records:', error)
      toast({ title: 'Error', description: 'Unable to load Hifz tracker records.', variant: 'destructive' })
      return
    }

    setRecords(data || [])
  }

  const handleSaveRecord = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedStudentId) {
      toast({ title: 'Select student', description: 'Choose a student before saving.', variant: 'destructive' })
      return
    }

    const trackerItem = selectedMode === 'quran' ? quranTrackerItem.trim() : selectedMutoon.trim()
    if (!trackerItem) {
      toast({ title: 'Missing item', description: 'Enter a Quran item or select a Mutoon item.', variant: 'destructive' })
      return
    }

    setIsSaving(true)

    try {
      const payload = {
        student_id: selectedStudentId,
        mode: selectedMode,
        tracker_item: trackerItem,
        status,
        grade: grade || null,
        date: new Date(recordDate).toISOString(),
        notes: notes.trim() || null,
        recorded_by: user?.id || null
      }

      const { error } = await supabase
        .from('hifz_records')
        .insert(payload)

      if (error) {
        throw error
      }

      toast({ title: 'Saved', description: 'Hifz tracker record saved successfully.' })
      setQuranTrackerItem('')
      setNotes('')
      setGrade(100)
      await fetchRecords()
    } catch (error) {
      console.error('Error saving hifz record:', error)
      toast({ title: 'Error', description: 'Failed to save tracker record.', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddMutoon = async () => {
    const value = newMutoonName.trim()
    if (!value) {
      toast({ title: 'Add a mutoon name', description: 'Enter the name of the new mutoon first.', variant: 'destructive' })
      return
    }

    setIsAddingMutoon(true)
    try {
      const { error } = await supabase
        .from('hifz_mutoon')
        .insert({ name: value })

      if (error) {
        throw error
      }

      setNewMutoonName('')
      toast({ title: 'Added', description: 'New mutoon added to the tracker list.' })
      await fetchMutoonList()
      setSelectedMutoon(value)
    } catch (error) {
      console.error('Error adding mutoon:', error)
      toast({ title: 'Error', description: 'Unable to add new mutoon.', variant: 'destructive' })
    } finally {
      setIsAddingMutoon(false)
    }
  }

  const safeRecords = selectedStudentId ? records.filter(record => record.student_id === selectedStudentId) : []
  const student = students.find((studentItem) => studentItem.id === selectedStudentId)

  const summary = useMemo(() => {
    const counts = { quran: 0, mutoon: 0, total: 0, completed: 0, averageGrade: 0 }
    let gradeSum = 0
    let gradeCount = 0

    records.forEach((record) => {
      counts.total += 1
      if (record.mode === 'quran') counts.quran += 1
      if (record.mode === 'mutoon') counts.mutoon += 1
      if (record.status === 'memorized' || record.status === 'reviewed') counts.completed += 1
      if (typeof record.grade === 'number') {
        gradeSum += record.grade
        gradeCount += 1
      }
    })

    counts.averageGrade = gradeCount > 0 ? Math.round(gradeSum / gradeCount) : 0
    return counts
  }, [records])

  const studentSummaries = useMemo(() => {
    const byStudent: Record<string, { studentName: string; records: number; averageGrade: number; lastRecordedAt: string }> = {}

    records.forEach((record) => {
      const existing = byStudent[record.student_id] || { studentName: '', records: 0, averageGrade: 0, lastRecordedAt: record.date }
      const studentName = students.find((item) => item.id === record.student_id)?.name || existing.studentName || 'Unknown'
      const previousGrade = existing.averageGrade * existing.records
      const gradeCount = existing.records + (typeof record.grade === 'number' ? 1 : 0)
      const gradeSum = previousGrade + (typeof record.grade === 'number' ? record.grade : 0)

      byStudent[record.student_id] = {
        studentName,
        records: existing.records + 1,
        averageGrade: gradeCount > 0 ? Math.round(gradeSum / gradeCount) : 0,
        lastRecordedAt: new Date(record.date) > new Date(existing.lastRecordedAt) ? record.date : existing.lastRecordedAt
      }
    })

    return Object.entries(byStudent).map(([studentId, summary]) => ({ studentId, ...summary }))
  }, [records, students])

  const canAccessHifz = ['teacher', 'staff', 'principal', 'admin'].includes(userRole || '')

  if (!canAccessHifz) {
    return (
      <ProtectedRoute>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Hifz Tracker</h1>
          <p>You do not have permission to access this page.</p>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Hifz Tracker</h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Track Quran and Mutoon memorization progress per student, record grades and dates, and review management summaries.
            </p>
          </div>
          <Button variant="secondary" onClick={fetchInitialData}>
            Refresh data
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>New Hifz Record</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveRecord} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="student">Student</Label>
                      <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                        <SelectTrigger id="student" className="w-full">
                          <SelectValue placeholder="Choose a student" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((studentItem) => (
                            <SelectItem key={studentItem.id} value={studentItem.id}>
                              {studentItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mode">Mode</Label>
                      <Select value={selectedMode} onValueChange={(value) => setSelectedMode(value as 'quran' | 'mutoon')}>
                        <SelectTrigger id="mode" className="w-full">
                          <SelectValue placeholder="Choose mode" />
                        </SelectTrigger>
                        <SelectContent>
                          {MODE_OPTIONS.map((mode) => (
                            <SelectItem key={mode.value} value={mode.value}>
                              {mode.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {selectedMode === 'quran' ? (
                    <div className="space-y-2">
                      <Label htmlFor="quranTrackerItem">Quran item</Label>
                      <Input
                        id="quranTrackerItem"
                        value={quranTrackerItem}
                        onChange={(event) => setQuranTrackerItem(event.target.value)}
                        placeholder="Surah, Juz, or ayah reference"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="mutoon">Mutoon item</Label>
                      <Select value={selectedMutoon} onValueChange={setSelectedMutoon}>
                        <SelectTrigger id="mutoon" className="w-full">
                          <SelectValue placeholder="Choose a mutoon" />
                        </SelectTrigger>
                        <SelectContent>
                          {mutoonList.map((item) => (
                            <SelectItem key={item.id} value={item.name}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={status} onValueChange={(value) => setStatus(value as HifzRecord['status'])}>
                        <SelectTrigger id="status" className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade</Label>
                      <Input
                        id="grade"
                        type="number"
                        min={0}
                        max={100}
                        value={grade}
                        onChange={(event) => setGrade(Number(event.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={recordDate}
                        onChange={(event) => setRecordDate(event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        placeholder="Optional note for progress or review"
                        className="h-24"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-end">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save record'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add More Mutoon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newMutoon">New Mutoon</Label>
                  <Input
                    id="newMutoon"
                    value={newMutoonName}
                    onChange={(event) => setNewMutoonName(event.target.value)}
                    placeholder="Enter a new mutoon name"
                  />
                </div>
                <Button type="button" onClick={handleAddMutoon} disabled={isAddingMutoon}>
                  {isAddingMutoon ? 'Adding…' : 'Add Mutoon'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{student ? `${student.name} records` : 'Student records'}</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedStudentId && safeRecords.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Mode</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {safeRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{formatDate(record.date)}</TableCell>
                            <TableCell>{record.mode === 'quran' ? 'Quran' : 'Mutoon'}</TableCell>
                            <TableCell>{record.tracker_item}</TableCell>
                            <TableCell>{record.grade ?? '-'}</TableCell>
                            <TableCell>
                              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(record.status)}`}>
                                {record.status.replace('_', ' ').replace(/^./, (c) => c.toUpperCase())}
                              </span>
                            </TableCell>
                            <TableCell>{record.notes || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No records found for this student yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Card>
                <CardContent className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Total students tracked</div>
                  <div className="text-3xl font-semibold">{new Set(records.map((record) => record.student_id)).size}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Quran records</div>
                  <div className="text-3xl font-semibold">{summary.quran}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Mutoon records</div>
                  <div className="text-3xl font-semibold">{summary.mutoon}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Average grade</div>
                  <div className="text-3xl font-semibold">{summary.averageGrade}%</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Management Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {studentSummaries.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Records</TableHead>
                          <TableHead>Avg Grade</TableHead>
                          <TableHead>Last Recorded</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentSummaries.map((summaryRow) => (
                          <TableRow key={summaryRow.studentId}>
                            <TableCell>{summaryRow.studentName}</TableCell>
                            <TableCell>{summaryRow.records}</TableCell>
                            <TableCell>{summaryRow.averageGrade}%</TableCell>
                            <TableCell>{formatDate(summaryRow.lastRecordedAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No tracker records have been saved yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
