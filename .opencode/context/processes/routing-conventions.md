# Routing & Page Conventions

## Next.js App Router Patterns

### Page Types

**Static pages** (no dynamic data):
```tsx
export default function PageName() {
  return <div>Content</div>
}
```

**Client interactive pages**:
```tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export default function PageName() {
  const { user, userRole } = useAuth()
  const [data, setData] = useState([])

  // Fetch data on mount or user action
  return <div>Content</div>
}
```

### Role-Based Access

```tsx
// Check role before rendering admin features
if (['staff', 'principal', 'admin'].includes(userRole || '')) {
  // Show admin UI
}

// Disable actions for unauthorized roles
<Button disabled={!['staff', 'principal', 'admin'].includes(userRole || '')}>
  Action
</Button>
```

### Data Fetching Pattern

```tsx
const fetchData = async () => {
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .eq('column', value)
  
  if (error) throw error
  return data
}
```

### Form Submission Pattern

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  try {
    const { data, error } = await supabase
      .from('table_name')
      .insert({ field1, field2 })
      .select()
      .single()
    
    if (error) throw error
    
    toast({ title: "Success", description: "..." })
    // Reset form
  } catch (error) {
    toast({ title: "Error", description: "...", variant: "destructive" })
  } finally {
    setIsSubmitting(false)
  }
}
```

### Component Import Pattern

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
```

### Layout Conventions

- Page wrapper: `<div className="space-y-4">`
- Page title: `<h1 className="text-2xl sm:text-3xl font-bold">Title</h1>`
- Grid layouts: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-{n} gap-4`
- Form grids: `grid grid-cols-1 md:grid-cols-2 gap-4`
- Form fields: `<div className="space-y-2">` wrapping Label + Input
