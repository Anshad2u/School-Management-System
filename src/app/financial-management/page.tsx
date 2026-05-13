'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

type Transaction = {
  id: string
  recipient_id: string
  amount: number
  type: string
  date: string
  recipient_name?: string
}

type StaffMember = {
  id: string
  name: string
  role: string
}

export default function FinancialManagementPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [selectedStaff, setSelectedStaff] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentType, setPaymentType] = useState('salary')
  const [balance, setBalance] = useState(0)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check for demo mode or auth
    const role = localStorage.getItem('demoRole') || (typeof window !== 'undefined' && window.navigator.userAgent.includes('Chrome') ? null : null)
    if (role) {
      setUserRole(role)
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      if (userRole === 'principal' || userRole === 'admin') {
        await Promise.all([fetchTransactions(), fetchStaff(), fetchSchoolBalance()])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      
      if (data) {
        const transactionsWithNames = data.map((t: any) => ({
          ...t,
          recipient_name: staff.find(s => s.id === t.recipient_id)?.name || 'Unknown'
        }))
        setTransactions(transactionsWithNames)
      }
    } catch (error: any) {
      console.error('Error fetching transactions:', error)
      setTransactions([])
    }
  }

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, role')
        .in('role', ['teacher', 'staff', 'principal'])

      if (error) throw error
      const staffData = (data || []).map((s: any) => ({
        id: s.id,
        name: s.username || 'Unknown',
        role: s.role
      }))
      setStaff(staffData)
      
      // Update transactions with new staff data
      setTransactions(prev => prev.map(t => ({
        ...t,
        recipient_name: staffData.find(s => s.id === t.recipient_id)?.name || 'Unknown'
      })))
    } catch (error: any) {
      console.error('Error fetching staff:', error)
      setStaff([])
    }
  }

  const fetchSchoolBalance = async () => {
    try {
      const { data, error } = await supabase
        .from('school_finances')
        .select('amount')
        .eq('type', 'balance')
        .single()

      if (data && !error) {
        setBalance(data.amount || 0)
        return
      }
      setBalance(0)
    } catch (error: any) {
      console.error('Error fetching school balance:', error)
      setBalance(0)
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedStaff || !amount) {
      toast({
        title: "Error",
        description: "Please select a recipient and enter an amount.",
        variant: "destructive",
      })
      return
    }

    if (userRole !== 'principal' && userRole !== 'admin') {
      toast({
        title: "Error",
        description: "Only principals and admins can make payments.",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          recipient_id: selectedStaff,
          amount: parseFloat(amount),
          type: paymentType,
          date: new Date().toISOString()
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Payment recorded successfully.",
      })
      fetchData()
      setSelectedStaff('')
      setAmount('')
    } catch (error: any) {
      console.error('Error making payment:', error)
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!userRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-2xl font-bold mb-2">Loading...</h1>
      </div>
    )
  }

  if (userRole !== 'principal' && userRole !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-600">You need to be principal or admin to access this page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold">Financial Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>School Balance: ₹{balance.toFixed(2)}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="staff">Recipient</Label>
              <Select onValueChange={setSelectedStaff} value={selectedStaff} required>
                <SelectTrigger>
                  <SelectValue placeholder={staff.length > 0 ? "Select staff member" : "Loading staff..."} />
                </SelectTrigger>
                <SelectContent>
                  {staff.length > 0 ? staff.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </SelectItem>
                  )) : (
                    <SelectItem value="none" disabled>No staff found</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                required
                min="1"
                step="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentType">Payment Type</Label>
              <Select onValueChange={setPaymentType} value={paymentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="bonus">Bonus</SelectItem>
                  <SelectItem value="reimbursement">Reimbursement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button type="submit" disabled={staff.length === 0}>
              Send Payment (₹{amount || '0'})
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions ({transactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No transactions recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.recipient_name || staff.find(s => s.id === transaction.recipient_id)?.name || 'Unknown'}</TableCell>
                      <TableCell>₹{transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
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