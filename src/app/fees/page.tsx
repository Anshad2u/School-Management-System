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
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Receipt, Eye, Printer } from 'lucide-react'

const FEE_CATEGORIES = [
  'Admission Fee',
  'Tuition Fee Q1',
  'Tuition Fee Q2',
  'Tuition Fee Q3',
  'Tuition Fee Q4',
  'Uniform Fee',
  'Books Fee',
  'Transport Fee',
  'Exam Fee',
  'Other'
]

type FeeRecord = {
  id: string
  student_id: string
  amount: number
  status: string
  category: string
  payment_date: string
  receipt_number: string
  notes: string
  created_at: string
  student_name?: string
}

type Student = {
  id: string
  name: string
  grade: string
}

export default function FeesPage() {
  const [fees, setFees] = useState<FeeRecord[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const { user, userRole } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchStudents()
    fetchFees()
  }, [])

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('id, name, grade')
      .eq('status', 'active')
      .order('name')
    if (error) { console.error('Error fetching students:', error); return }
    setStudents(data || [])
  }

  const fetchFees = async () => {
    setLoading(true)
    try {
      const { data: feesData, error } = await supabase
        .from('fees')
        .select('*')
        .order('payment_date', { ascending: false })
      
      if (error) throw error
      
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
      toast({ title: "Error", description: "Could not load fees", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const generateReceiptNumber = () => {
    const prefix = category.split(' ')[0].substring(0, 3).toUpperCase()
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 9000 + 1000)
    return `${prefix}-${date}-${random}`
  }

  const handleRecordFee = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudentId || !category || !amount) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      const receiptNumber = generateReceiptNumber()
      const { error } = await supabase.from('fees').insert({
        student_id: selectedStudentId,
        amount: parseFloat(amount),
        status: 'paid',
        category,
        payment_date: new Date().toISOString(),
        receipt_number: receiptNumber,
        notes: notes || null
      })
      if (error) throw error
      
      toast({ title: "Success", description: `Fee receipt ${receiptNumber} recorded successfully` })
      setSelectedStudentId('')
      setCategory('')
      setAmount('')
      setNotes('')
      fetchFees()
    } catch (error) {
      console.error('Error recording fee:', error)
      toast({ title: "Error", description: "Failed to record fee", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewReceipt = (fee: FeeRecord) => {
    setSelectedFee(fee)
    setShowReceipt(true)
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  const selectedStudent = students.find(s => s.id === selectedStudentId)

  return (
    <ProtectedRoute>
      <div className="space-y-4">
        {/* Print-only receipt */}
        {showReceipt && selectedFee && (
          <div className="hidden print:block print:p-8">
            <div className="max-w-[210mm] mx-auto font-serif">
              <div className="text-center border-b-2 border-black pb-4 mb-6">
                <h1 className="text-2xl font-bold uppercase tracking-wide">Gem Stone Salafi School</h1>
                <p className="text-sm mt-1">Fee Payment Receipt</p>
                <p className="text-xs text-gray-600 mt-1">Receipt No: {selectedFee.receipt_number}</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <p><span className="font-semibold">Student Name:</span> {selectedFee.student_name}</p>
                  <p><span className="font-semibold">Date:</span> {new Date(selectedFee.payment_date).toLocaleDateString()}</p>
                  <p><span className="font-semibold">Category:</span> {selectedFee.category}</p>
                  <p><span className="font-semibold">Amount Paid:</span> ₹{selectedFee.amount.toFixed(2)}</p>
                </div>
                {selectedFee.notes && (
                  <p><span className="font-semibold">Notes:</span> {selectedFee.notes}</p>
                )}
                <div className="mt-12 pt-4 border-t border-gray-300">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="border-b border-black w-48 mx-auto mb-1"></div>
                      <p className="text-xs">Parent Signature</p>
                    </div>
                    <div className="text-center">
                      <div className="border-b border-black w-48 mx-auto mb-1"></div>
                      <p className="text-xs">Authorized Signature</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Screen UI */}
        <div className="print:hidden space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Fee Management</h1>
          </div>

          {/* Record Fee Form */}
          {['staff', 'principal', 'admin'].includes(userRole || '') && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Record Fee Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRecordFee} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="student">Select Student *</Label>
                      <Select value={selectedStudentId} onValueChange={setSelectedStudentId} required>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Choose a student" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map(student => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name} ({student.grade})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Fee Category *</Label>
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {FEE_CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (₹) *</Label>
                      <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" required min="1" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" rows={1} className="resize-none h-11" />
                    </div>
                  </div>
                  <Button type="submit" disabled={isSubmitting || !selectedStudentId || !category || !amount} className="w-full h-11">
                    {isSubmitting ? 'Recording...' : 'Record Payment & Generate Receipt'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Fee History */}
          <Card>
            <CardHeader>
              <CardTitle>Fee History</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>)}
                </div>
              ) : fees.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No fees recorded yet</p>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Receipt #</th>
                        <th className="p-3 text-left font-medium">Student</th>
                        <th className="p-3 text-left font-medium hidden sm:table-cell">Category</th>
                        <th className="p-3 text-right font-medium">Amount</th>
                        <th className="p-3 text-left font-medium hidden md:table-cell">Date</th>
                        <th className="p-3 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.map((fee) => (
                        <tr key={fee.id} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-mono text-xs">{fee.receipt_number || '—'}</td>
                          <td className="p-3 font-medium">{fee.student_name}</td>
                          <td className="p-3 hidden sm:table-cell">
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">{fee.category}</span>
                          </td>
                          <td className="p-3 text-right font-semibold">₹{fee.amount.toFixed(2)}</td>
                          <td className="p-3 text-muted-foreground hidden md:table-cell">
                            {fee.payment_date ? new Date(fee.payment_date).toLocaleDateString() : '—'}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewReceipt(fee)} title="View Receipt">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedFee(fee); setShowReceipt(true); setTimeout(() => window.print(), 100) }} title="Print Receipt">
                                <Printer className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
