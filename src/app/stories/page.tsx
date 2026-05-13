'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

type Story = {
  id: string
  content: string
  created_at: string
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setStories(data)
    } catch (error) {
      console.error('Error fetching stories:', error)
      setError('Failed to load stories. Please try again later.')
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
        .from('stories')
        .insert({
          content
        })

      if (error) throw error

      setContent('')
      fetchStories()
      toast({
        title: "Success",
        description: "Story uploaded successfully",
      })
    } catch (error) {
      console.error('Error uploading story:', error)
      toast({
        title: "Error",
        description: "Failed to upload story. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold">Stories</h1>
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Upload a Story</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Story Content</Label>
                <Input
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="h-11">
                {isSubmitting ? 'Uploading...' : 'Upload Story'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Stories</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : stories.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No stories yet</p>
          ) : (
            stories.map((story) => (
              <div key={story.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-semibold mb-1">Admin</p>
                <p className="mb-1">{story.content}</p>
                <p className="text-sm text-gray-500">{new Date(story.created_at).toLocaleString()}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}