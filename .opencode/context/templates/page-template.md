# Page Template

Standard template for new pages in the School Management System.

## Interactive Page Template

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export default function PageName() {
  const { user, userRole } = useAuth()
  const { toast } = useToast()
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
    
    if (error) {
      console.error('Error fetching data:', error)
      return
    }
    setData(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('table_name')
        .insert({ /* fields */ })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Success",
        description: "Record created successfully",
      })
      
      fetchData()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to create record",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold">Page Title</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Section Title</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Content */}
        </CardContent>
      </Card>
    </div>
  )
}
```

## Form Field Template

```tsx
<div className="space-y-2">
  <Label htmlFor="fieldName">Field Label</Label>
  <Input 
    id="fieldName" 
    value={value}
    onChange={(e) => setValue(e.target.value)}
    placeholder="Enter value" 
    required
    className="h-11"
  />
</div>
```

## Data Table Template

```tsx
<div className="rounded-md border">
  <table className="w-full text-sm">
    <thead>
      <tr className="border-b bg-muted/50">
        <th className="p-3 text-left font-medium">Column 1</th>
        <th className="p-3 text-left font-medium">Column 2</th>
        <th className="p-3 text-left font-medium">Actions</th>
      </tr>
    </thead>
    <tbody>
      {data.map((item) => (
        <tr key={item.id} className="border-b">
          <td className="p-3">{item.field1}</td>
          <td className="p-3">{item.field2}</td>
          <td className="p-3">
            <Button variant="outline" size="sm">Edit</Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```
