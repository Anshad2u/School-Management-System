'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import ProtectedRoute from '@/components/ProtectedRoute'
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from 'lucide-react'

type FeeSummary = {
  category: string
  total: number
  count: number
}

type ExpenseSummary = {
  category: string
  total: number
  count: number
}

type MonthlyData = {
  month: string
  income: number
  expenses: number
}

export default function FinancialPerformancePage() {
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [feeBreakdown, setFeeBreakdown] = useState<FeeSummary[]>([])
  const [expenseBreakdown, setExpenseBreakdown] = useState<ExpenseSummary[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [feesRes, expensesRes] = await Promise.all([
        supabase.from('fees').select('amount, category, payment_date').eq('status', 'paid'),
        supabase.from('expenses').select('amount, category, expense_date')
      ])

      const fees = feesRes.data || []
      const expenses = expensesRes.data || []

      // Totals
      const income = fees.reduce((sum, f) => sum + Number(f.amount), 0)
      const exp = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
      setTotalIncome(income)
      setTotalExpenses(exp)

      // Fee breakdown by category
      const feeMap = new Map<string, { total: number; count: number }>()
      fees.forEach(f => {
        const cat = f.category || 'Other'
        const existing = feeMap.get(cat) || { total: 0, count: 0 }
        feeMap.set(cat, { total: existing.total + Number(f.amount), count: existing.count + 1 })
      })
      setFeeBreakdown(
        Array.from(feeMap.entries())
          .map(([category, data]) => ({ category, ...data }))
          .sort((a, b) => b.total - a.total)
      )

      // Expense breakdown by category
      const expMap = new Map<string, { total: number; count: number }>()
      expenses.forEach(e => {
        const cat = e.category || 'Other'
        const existing = expMap.get(cat) || { total: 0, count: 0 }
        expMap.set(cat, { total: existing.total + Number(e.amount), count: existing.count + 1 })
      })
      setExpenseBreakdown(
        Array.from(expMap.entries())
          .map(([category, data]) => ({ category, ...data }))
          .sort((a, b) => b.total - a.total)
      )

      // Monthly data (last 6 months)
      const monthMap = new Map<string, { income: number; expenses: number }>()
      const now = new Date()
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
        monthMap.set(key, { income: 0, expenses: 0, month: label } as any)
      }

      fees.forEach(f => {
        if (!f.payment_date) return
        const key = f.payment_date.slice(0, 7)
        const existing = monthMap.get(key)
        if (existing) existing.income += Number(f.amount)
      })

      expenses.forEach(e => {
        if (!e.expense_date) return
        const key = new Date(e.expense_date).toISOString().slice(0, 7)
        const existing = monthMap.get(key)
        if (existing) existing.expenses += Number(e.amount)
      })

      setMonthlyData(
        Array.from(monthMap.entries())
          .map(([key, data]) => ({ ...data, month: (data as any).month }))
      )
    } catch (error) {
      console.error('Error fetching financial data:', error)
      toast({ title: "Error", description: "Could not load financial data", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const netBalance = totalIncome - totalExpenses
  const maxFeeTotal = Math.max(...feeBreakdown.map(f => f.total), 1)
  const maxExpTotal = Math.max(...expenseBreakdown.map(e => e.total), 1)
  const maxMonthly = Math.max(...monthlyData.map(m => Math.max(m.income, m.expenses)), 1)

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading financial data...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Financial Performance</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Income</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Expenses</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${netBalance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
                  <Wallet className={`w-5 h-5 ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    ₹{netBalance.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Net Balance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Monthly Trend (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyData.map(m => (
                <div key={m.month} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium w-16">{m.month}</span>
                    <div className="flex-1 mx-4 flex gap-1">
                      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${(m.income / maxMonthly) * 100}%` }} />
                      </div>
                      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${(m.expenses / maxMonthly) * 100}%` }} />
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs w-32 justify-end">
                      <span className="text-green-600">₹{m.income.toLocaleString()}</span>
                      <span className="text-red-600">₹{m.expenses.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded" /> Income
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded" /> Expenses
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fee Income Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Fee Income by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {feeBreakdown.map(f => (
                <div key={f.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{f.category}</span>
                    <span className="text-xs text-muted-foreground">({f.count} payments)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${(f.total / maxFeeTotal) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium w-24 text-right">₹{f.total.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expenseBreakdown.map(e => (
                <div key={e.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{e.category}</span>
                    <span className="text-xs text-muted-foreground">({e.count} entries)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: `${(e.total / maxExpTotal) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium w-24 text-right">₹{e.total.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
