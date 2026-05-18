'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

export default function AdmissionsPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState('')
  const [grade, setGrade] = useState('')
  const [parentName, setParentName] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [admissionFee, setAdmissionFee] = useState('')
  const [feeStatus, setFeeStatus] = useState('pending')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { user, userRole } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (['staff', 'principal', 'admin'].includes(userRole || '') && !isSubmitting) {
      setIsSubmitting(true)
      try {
        const fullName = `${firstName} ${lastName}`
        const age = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : null
        
        const { data, error } = await supabase.from('students').insert({
          name: fullName,
          grade: grade || `Age ${age || 6}`,
          age: age,
          date_of_birth: dob || null,
          parent_name: parentName,
          contact_number: contactNumber,
          status: 'active'
        }).select().single()

        if (error) throw error

        await supabase.from('profiles').insert({
          id: data.id,
          username: fullName,
          phone_number: contactNumber,
          role: 'student'
        })

        if (admissionFee && data?.id) {
          await supabase.from('fees').insert({
            student_id: data.id,
            amount: parseFloat(admissionFee),
            status: feeStatus
          })
        }

        setSubmitted(true)
        toast({
          title: "Success",
          description: `${fullName} has been admitted successfully!`,
        })
        
        setFirstName('')
        setLastName('')
        setDob('')
        setGrade('')
        setParentName('')
        setContactNumber('')
        setAdmissionFee('')
        setFeeStatus('pending')
      } catch (error) {
        console.error('Error admitting student:', error)
        toast({
          title: "Error",
          description: "Failed to admit student. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold">Student Admission - Gem Stone Salafi School</h1>
      
      {submitted && (
        <div className="p-4 bg-green-100 border-2 border-green-300 rounded-lg animate-bounce">
          <p className="text-green-800 font-bold text-lg text-center">✓ Student admitted successfully!</p>
          <p className="text-green-700 text-sm text-center mt-1">Check the Students page to see the admitted student</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>New Student Application</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name" 
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name" 
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input 
                  id="dob" 
                  type="date" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Input 
                  id="grade" 
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g. Grade 1" 
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentName">Parent/Guardian Name</Label>
                <Input 
                  id="parentName" 
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="Enter parent/guardian name" 
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input 
                  id="contactNumber" 
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Enter contact number" 
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admissionFee">Admission Fee (if paid) in ₹</Label>
                <Input 
                  id="admissionFee" 
                  type="number"
                  value={admissionFee}
                  onChange={(e) => setAdmissionFee(e.target.value)}
                  placeholder="Amount in ₹" 
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feeStatus">Fee Status</Label>
                <Select value={feeStatus} onValueChange={setFeeStatus}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting || !['staff', 'principal', 'admin'].includes(userRole || '')} className="w-full h-11">
              {isSubmitting ? 'Processing...' : 'Submit Application'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}