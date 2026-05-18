'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import ProtectedRoute from '@/components/ProtectedRoute'

type Fee = {
  id: string
  student_id: string
  amount: number
  status: string
  created_at: string
  student_name?: string
}

type Student = {
  id: string
  name: string
}

const PREDEFINED_AMOUNTS = [500, 1000, 1500, 2000, 2500, 3000]

export default function FeesPage() {
  const [fees, setFees] = useState<Fee[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [amount, setAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const { userRole } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchStudents()
    fetchFees()
  }, [])

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase.from('students').select('id, name').order('name')
      if (error) throw error
      setStudents(data || [])
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const fetchFees = async () => {
    setLoading(true)
    try {
      // First get fees, then fetch student names separately
      const { data: feesData, error } = await supabase
        .from('fees')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Get all student IDs and fetch their names
      const studentIds = [...new Set(feesData?.map(f => f.student_id) || [])]
      const { data: studentsData } = await supabase
        .from('students')
        .select('id, name')
        .in('id', studentIds)
      
      const studentMap = new Map(studentsData?.map(s => [s.id, s.name]) || [])
      
      const feesWithNames = feesData?.map(f => ({
        ...f,
        student_name: studentMap.get(f.student_id) || 'Unknown'
      })) || []
      
      setFees(feesWithNames)
    } catch (error) {
      console.error('Error fetching fees:', error)
      toast({
        title: "Error",
        description: "Could not load fees",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddFee = async (e: React.FormEvent) => {
    e.preventDefault()
    const feeAmount = customAmount ? parseFloat(customAmount) : parseFloat(amount)
    
    if (!feeAmount || feeAmount <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" })
      return
    }

    try {
      const { error } = await supabase.from('fees').insert({
        student_id: selectedStudentId,
        amount: feeAmount,
        status: 'pending'
      })
      if (error) throw error
      toast({ title: "Success", description: "Fee added successfully" })
      fetchFees()
      setSelectedStudentId('')
      setAmount('')
      setCustomAmount('')
    } catch (error) {
      console.error('Error adding fee:', error)
      toast({
        title: "Error",
        description: "Could not add fee",
        variant: "destructive"
      })
    }
  }

  const handleAmountSelect = (value: string) => {
    setAmount(value)
    setCustomAmount('')
  }

  return (
    <ProtectedRoute>
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold">Fee Management - Gem Stone Salafi School</h1>
      
      {['staff', 'principal', 'admin'].includes(userRole || '') && (
        <Card>
          <CardHeader>
            <CardTitle>Add Fee</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddFee} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student">Select Student</Label>
                <Select value={selectedStudentId} onValueChange={setSelectedStudentId} required>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Choose a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Fee Amount</Label>
                <div className="grid grid-cols-3 gap-2">
                  {PREDEFINED_AMOUNTS.map(amt => (
                    <Button
                      key={amt}
                      type="button"
                      variant={amount === amt.toString() ? "default" : "outline"}
                      onClick={() => handleAmountSelect(amt.toString())}
                      className="h-11"
                    >
                      ₹{amt}
                    </Button>
                  ))}
                </div>
                <div className="pt-2">
                  <Input
                    type="number"
                    placeholder="Custom amount in ₹"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value)
                      setAmount('')
                    }}
                    className="h-11"
                  />
                </div>
              </div>
              
              <Button type="submit" disabled={!selectedStudentId || !amount && !customAmount} className="w-full h-11">
                Add Fee
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Fee History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2].map(i => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>)}
            </div>
          ) : fees.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No fees found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fees.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell className="font-medium">{fee.student_name}</TableCell>
                      <TableCell>₹{fee.amount}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          fee.status === 'paid' ? 'bg-green-100 text-green-800' :
                          fee.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {fee.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(fee.created_at).toLocaleDateString()}</TableCell>
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