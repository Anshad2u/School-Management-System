'use client'

import { useState, useEffect } from 'react'
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
import { Receipt, Trash2 } from 'lucide-react'

const EXPENSE_CATEGORIES = [
  'Salary',
  'Utilities',
  'Maintenance',
  'Supplies',
  'Transport',
  'Technology',
  'Events',
  'Insurance',
  'Rent',
  'Food',
  'Miscellaneous'
]

type Expense = {
  id: string
  category: string
  amount: number
  description: string
  expense_date: string
  created_at: string
}

export default function SchoolExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, userRole } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('expense_date', { ascending: false })
    
    if (error) { console.error('Error fetching expenses:', error); return }
    setExpenses(data || [])
    setLoading(false)
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !amount) {
      toast({ title: "Error", description: "Please fill category and amount", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('expenses').insert({
        category,
        amount: parseFloat(amount),
        description: description || null,
        expense_date: expenseDate,
        recorded_by: user?.id
      })
      if (error) throw error
      
      toast({ title: "Success", description: "Expense recorded successfully" })
      setCategory('')
      setAmount('')
      setDescription('')
      setExpenseDate(new Date().toISOString().split('T')[0])
      fetchExpenses()
    } catch (error) {
      console.error('Error recording expense:', error)
      toast({ title: "Error", description: "Failed to record expense", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (error) { toast({ title: "Error", description: "Failed to delete", variant: "destructive" }); return }
    toast({ title: "Deleted", description: "Expense removed" })
    fetchExpenses()
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const thisMonth = expenses
    .filter(e => new Date(e.expense_date).getMonth() === new Date().getMonth())
    .reduce((sum, e) => sum + Number(e.amount), 0)

  const categoryBreakdown = EXPENSE_CATEGORIES.map(cat => ({
    category: cat,
    total: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + Number(e.amount), 0)
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total)

  return (
    <ProtectedRoute>
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold">School Expenses</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Expenses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-orange-600">₹{thisMonth.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">This Month</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Expense Form */}
        {['admin', 'principal'].includes(userRole || '') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Record Expense
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {EXPENSE_CATEGORIES.map(cat => (
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
                    <Label htmlFor="expenseDate">Date</Label>
                    <Input id="expenseDate" type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What was this expense for?" rows={1} className="resize-none h-11" />
                  </div>
                </div>
                <Button type="submit" disabled={isSubmitting || !category || !amount} className="w-full h-11">
                  {isSubmitting ? 'Recording...' : 'Record Expense'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categoryBreakdown.map(cat => (
                  <div key={cat.category} className="flex items-center justify-between">
                    <span className="text-sm">{cat.category}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500 rounded-full" 
                          style={{ width: `${(cat.total / totalExpenses) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-24 text-right">₹{cat.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Expense History */}
        <Card>
          <CardHeader>
            <CardTitle>Expense History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>)}
              </div>
            ) : expenses.length === 0 ? (
              <p className="text-center py-4 text-gray-500">No expenses recorded yet</p>
            ) : (
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">Category</th>
                      <th className="p-3 text-left font-medium hidden sm:table-cell">Description</th>
                      <th className="p-3 text-right font-medium">Amount</th>
                      <th className="p-3 text-left font-medium hidden md:table-cell">Date</th>
                      {['admin', 'principal'].includes(userRole || '') && (
                        <th className="p-3 text-right font-medium">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-red-50 text-red-700">{expense.category}</span>
                        </td>
                        <td className="p-3 text-muted-foreground hidden sm:table-cell">{expense.description || '—'}</td>
                        <td className="p-3 text-right font-semibold">₹{expense.amount.toFixed(2)}</td>
                        <td className="p-3 text-muted-foreground hidden md:table-cell">
                          {new Date(expense.expense_date).toLocaleDateString()}
                        </td>
                        {['admin', 'principal'].includes(userRole || '') && (
                          <td className="p-3 text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(expense.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
