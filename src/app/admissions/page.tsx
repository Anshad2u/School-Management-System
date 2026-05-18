'use client'

import { useState, useRef, useEffect } from 'react'
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

interface FormData {
  firstName: string
  lastName: string
  dob: string
  gender: string
  grade: string
  parentName: string
  contactNumber: string
  homeAddress: string
  emergencyContact: string
  admissionFee: string
  feeStatus: string
}

interface StudentRecord {
  id: string
  name: string
  grade: string
  age: number | null
  date_of_birth: string | null
  gender: string | null
  parent_name: string | null
  contact_number: string | null
  home_address: string | null
  emergency_contact: string | null
  photo_url: string | null
  status: string
  admission_date: string | null
  created_at: string
}

const initialForm: FormData = {
  firstName: '', lastName: '', dob: '', gender: '', grade: '',
  parentName: '', contactNumber: '', homeAddress: '', emergencyContact: '',
  admissionFee: '', feeStatus: 'pending'
}

export default function AdmissionsPage() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [recentAdmissions, setRecentAdmissions] = useState<StudentRecord[]>([])
  const [printStudent, setPrintStudent] = useState<StudentRecord | null>(null)
  const [printForm, setPrintForm] = useState<FormData | null>(null)
  const { user, userRole } = useAuth()
  const { toast } = useToast()
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchRecentAdmissions()
  }, [])

  const fetchRecentAdmissions = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (error) {
      console.error('Error fetching admissions:', error)
      return
    }
    setRecentAdmissions(data || [])
  }

  const update = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!['staff', 'principal', 'admin'].includes(userRole || '')) return
    
    setIsSubmitting(true)
    try {
      const fullName = `${form.firstName} ${form.lastName}`.trim()
      const age = form.dob ? new Date().getFullYear() - new Date(form.dob).getFullYear() : null
      
      let photoUrl = ''
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('student-photos')
          .upload(fileName, photoFile)
        
        if (uploadError) throw uploadError
        
        const { data: urlData } = supabase.storage
          .from('student-photos')
          .getPublicUrl(fileName)
        photoUrl = urlData.publicUrl
      }

      const { data, error } = await supabase.from('students').insert({
        name: fullName,
        grade: form.grade || `Age ${age || 6}`,
        age,
        date_of_birth: form.dob || null,
        gender: form.gender || null,
        parent_name: form.parentName,
        contact_number: form.contactNumber,
        home_address: form.homeAddress || null,
        emergency_contact: form.emergencyContact || null,
        photo_url: photoUrl || null,
        status: 'active'
      }).select().single()

      if (error) throw error

      await supabase.from('profiles').insert({
        id: data.id,
        username: fullName,
        phone_number: form.contactNumber,
        role: 'student'
      })

      if (form.admissionFee && data?.id) {
        await supabase.from('fees').insert({
          student_id: data.id,
          amount: parseFloat(form.admissionFee),
          status: form.feeStatus
        })
      }

      toast({ title: "Success", description: `${fullName} has been admitted successfully!` })
      setForm(initialForm)
      setPhotoFile(null)
      setPhotoPreview('')
      setShowForm(false)
      fetchRecentAdmissions()
    } catch (error) {
      console.error('Error admitting student:', error)
      toast({ title: "Error", description: "Failed to admit student. Please try again.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePrint = (student: StudentRecord) => {
    setPrintStudent(student)
    setPrintForm(null)
    setTimeout(() => window.print(), 100)
  }

  const canSubmit = ['staff', 'principal', 'admin'].includes(userRole || '')

  return (
    <ProtectedRoute>
      <div className="space-y-4">
      {/* Print-only admission form */}
      <div ref={printRef} className="hidden print:block print:p-8">
        {printStudent && (
          <div className="max-w-[210mm] mx-auto font-serif">
            <div className="text-center border-b-2 border-black pb-4 mb-6">
              <h1 className="text-2xl font-bold uppercase tracking-wide">Gem Stone Salafi School</h1>
              <p className="text-sm mt-1">Student Admission Form</p>
              <p className="text-xs text-gray-600 mt-1">Academic Year {new Date().getFullYear()}-{new Date().getFullYear() + 1}</p>
            </div>

            <div className="flex justify-end mb-4">
              <div className="w-32 h-40 border border-gray-400 flex items-center justify-center bg-gray-50">
                {printStudent.photo_url ? (
                  <img src={printStudent.photo_url} alt="Student" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-500">Photo</span>
                )}
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <h2 className="font-bold text-base border-b border-gray-300 pb-1">Student Information</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <p><span className="font-semibold">Full Name:</span> {printStudent.name}</p>
                <p><span className="font-semibold">Date of Birth:</span> {printStudent.date_of_birth ? new Date(printStudent.date_of_birth).toLocaleDateString() : '—'}</p>
                <p><span className="font-semibold">Gender:</span> {printStudent.gender ? printStudent.gender.charAt(0).toUpperCase() + printStudent.gender.slice(1) : '—'}</p>
                <p><span className="font-semibold">Grade:</span> {printStudent.grade}</p>
                <p><span className="font-semibold">Age:</span> {printStudent.age || '—'}</p>
                <p><span className="font-semibold">Admission Date:</span> {printStudent.admission_date ? new Date(printStudent.admission_date).toLocaleDateString() : '—'}</p>
              </div>

              <h2 className="font-bold text-base border-b border-gray-300 pb-1 mt-4">Parent / Guardian Information</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <p><span className="font-semibold">Parent Name:</span> {printStudent.parent_name || '—'}</p>
                <p><span className="font-semibold">Contact Number:</span> {printStudent.contact_number || '—'}</p>
                <p><span className="font-semibold">Emergency Contact:</span> {printStudent.emergency_contact || '—'}</p>
                <p><span className="font-semibold">Home Address:</span> {printStudent.home_address || '—'}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-300">
                <p className="text-sm mb-8">I hereby declare that the information provided above is true and correct to the best of my knowledge. I agree to abide by the rules and regulations of Gem Stone Salafi School.</p>
                
                <div className="grid grid-cols-2 gap-8 mt-12">
                  <div className="text-center">
                    <div className="border-b border-black w-48 mx-auto mb-1"></div>
                    <p className="text-xs">Parent / Guardian Signature</p>
                    <p className="text-xs mt-1">Date: _______________</p>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-black w-48 mx-auto mb-1"></div>
                    <p className="text-xs">Authorized School Official</p>
                    <p className="text-xs mt-1">Date: _______________</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
                <p>Gem Stone Salafi School • For office use only • Application ID: {printStudent.id?.slice(0, 8)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Screen UI */}
      <div className="print:hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Student Admission</h1>
          <Button onClick={() => setShowForm(!showForm)} className="h-11">
            {showForm ? 'View Recent Admissions' : 'Add New Admission'}
          </Button>
        </div>

        {showForm ? (
          <Card>
            <CardHeader>
              <CardTitle>New Student Application</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student Photo */}
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
                  <div className="w-20 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-400">Photo</span>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="photo">Student Photo</Label>
                    <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">Passport size photo (JPG, PNG)</p>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="Enter first name" required className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Enter last name" required className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" value={form.dob} onChange={(e) => update('dob', e.target.value)} required className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={form.gender} onValueChange={(v) => update('gender', v)}>
                        <SelectTrigger className="h-11"><SelectValue placeholder="Select gender" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade</Label>
                      <Input id="grade" value={form.grade} onChange={(e) => update('grade', e.target.value)} placeholder="e.g. Grade 1" required className="h-11" />
                    </div>
                  </div>
                </div>

                {/* Parent & Contact Information */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Parent & Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="parentName">Parent / Guardian Name</Label>
                      <Input id="parentName" value={form.parentName} onChange={(e) => update('parentName', e.target.value)} placeholder="Enter parent/guardian name" required className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <Input id="contactNumber" value={form.contactNumber} onChange={(e) => update('contactNumber', e.target.value)} placeholder="Enter contact number" required className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input id="emergencyContact" value={form.emergencyContact} onChange={(e) => update('emergencyContact', e.target.value)} placeholder="Emergency contact number" className="h-11" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="homeAddress">Home Address</Label>
                      <Textarea id="homeAddress" value={form.homeAddress} onChange={(e) => update('homeAddress', e.target.value)} placeholder="Enter full home address" rows={2} className="resize-none" />
                    </div>
                  </div>
                </div>

                {/* Fee Information */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Fee Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="admissionFee">Admission Fee (₹)</Label>
                      <Input id="admissionFee" type="number" value={form.admissionFee} onChange={(e) => update('admissionFee', e.target.value)} placeholder="Amount in ₹" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="feeStatus">Fee Status</Label>
                      <Select value={form.feeStatus} onValueChange={(v) => update('feeStatus', v)}>
                        <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting || !canSubmit} className="w-full h-11">
                  {isSubmitting ? 'Processing...' : 'Submit Application'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recent Admissions</CardTitle>
            </CardHeader>
            <CardContent>
              {recentAdmissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No admissions yet. Click "Add New Admission" to get started.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Student</th>
                        <th className="p-3 text-left font-medium hidden sm:table-cell">Grade</th>
                        <th className="p-3 text-left font-medium hidden md:table-cell">Parent</th>
                        <th className="p-3 text-left font-medium hidden lg:table-cell">Contact</th>
                        <th className="p-3 text-left font-medium hidden sm:table-cell">Date</th>
                        <th className="p-3 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAdmissions.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {student.photo_url && (
                                <img src={student.photo_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                              )}
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-xs text-muted-foreground sm:hidden">{student.grade}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 hidden sm:table-cell">{student.grade}</td>
                          <td className="p-3 hidden md:table-cell">{student.parent_name || '—'}</td>
                          <td className="p-3 hidden lg:table-cell">{student.contact_number || '—'}</td>
                          <td className="p-3 hidden sm:table-cell text-muted-foreground">
                            {student.created_at ? new Date(student.created_at).toLocaleDateString() : '—'}
                          </td>
                          <td className="p-3 text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handlePrint(student)}
                            >
                              Print
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </ProtectedRoute>
  )
}
