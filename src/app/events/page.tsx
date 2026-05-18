'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import ProtectedRoute from '@/components/ProtectedRoute'

type Event = {
  id: string
  title: string
  description: string
  date: string
  user_id: string
  created_at: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, userRole } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
      
      if (error) throw error
      
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
      setError('Failed to load events. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('events')
        .insert({
          title,
          description,
          date
        })

      if (error) throw error

      setTitle('')
      setDescription('')
      setDate('')
      fetchEvents()
      toast({
        title: "Success",
        description: "Event created successfully",
      })
    } catch (error) {
      console.error('Error creating event:', error)
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute>
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold">School Events</h1>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {(userRole === 'staff' || userRole === 'principal') && (
        <Card>
          <CardHeader>
            <CardTitle>Create Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="h-11">
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-20 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No upcoming events</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                <p className="mt-1">{event.description}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
    </ProtectedRoute>
  )
}