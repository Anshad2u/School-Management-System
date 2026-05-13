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

type SchoolSettings = {
  id: string
  name: string
  address: string
  description: string
  contact_phone: string
  contact_email: string
  address_line: string
  city: string
  state: string
  postal_code: string
  country: string
  website_url: string
  monday_start: string
  monday_end: string
  tuesday_start: string
  tuesday_end: string
  wednesday_start: string
  wednesday_end: string
  thursday_start: string
  thursday_end: string
  friday_start: string
  friday_end: string
  saturday_start: string
  saturday_end: string
  sunday_start: string
  sunday_end: string
  logo_url: string
  motto: string
  primary_color: string
  secondary_color: string
}

const defaultSettings: SchoolSettings = {
  id: '11111111-1111-1111-1111-111111111111',
  name: '',
  address: '',
  description: '',
  contact_phone: '',
  contact_email: '',
  address_line: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  website_url: '',
  monday_start: '',
  monday_end: '',
  tuesday_start: '',
  tuesday_end: '',
  wednesday_start: '',
  wednesday_end: '',
  thursday_start: '',
  thursday_end: '',
  friday_start: '',
  friday_end: '',
  saturday_start: '',
  saturday_end: '',
  sunday_start: '',
  sunday_end: '',
  logo_url: '',
  motto: '',
  primary_color: '#3b82f6',
  secondary_color: '#64748b'
}

export default function SchoolSettingsPage() {
  const [settings, setSettings] = useState<SchoolSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const { user, userRole } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('school_settings')
        .select('*')
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setSettings({ ...defaultSettings, ...data })
      } else {
        // No existing settings - use a fixed uuid for single-school system
        setSettings({ ...defaultSettings, id: '11111111-1111-1111-1111-111111111111' })
      }
    } catch (error) {
      console.error('Error fetching school settings:', error)
      toast({
        title: "Error",
        description: "Could not load school settings",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (userRole !== 'principal' && userRole !== 'admin') {
      toast({
        title: "Error",
        description: "Only principals and admins can modify school settings.",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase
        .from('school_settings')
        .upsert({
          id: settings.id || 1,
          ...settings,
          updated_by: user?.id
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "School settings updated successfully.",
      })
    } catch (error) {
      console.error('Error updating school settings:', error)
      toast({
        title: "Error",
        description: "Failed to update school settings. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: keyof SchoolSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  if (userRole && userRole !== 'principal' && userRole !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-2xl font-bold mb-2">No Permission</h1>
        <p className="text-gray-600">You do not have permission to access this page.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">School Settings</h1>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">School Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">School Name</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">School Description</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Phone Number</Label>
                <Input
                  id="contact_phone"
                  value={settings.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email Address</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="info@school.edu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line">Street Address</Label>
              <Input
                id="address_line"
                value={settings.address_line}
                onChange={(e) => handleInputChange('address_line', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={settings.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={settings.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={settings.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={settings.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={settings.website_url}
                  onChange={(e) => handleInputChange('website_url', e.target.value)}
                  placeholder="https://www.school.edu"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* School Timings */}
        <Card>
          <CardHeader>
            <CardTitle>School Timings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
              <div key={day} className="grid grid-cols-3 gap-4 items-end">
                <Label className="capitalize">{day}</Label>
                <div className="space-y-1">
                  <Label htmlFor={`${day}_start`} className="text-xs">Start</Label>
                  <Input
                    id={`${day}_start`}
                    type="time"
                    value={settings[`${day}_start` as keyof SchoolSettings] as string}
                    onChange={(e) => handleInputChange(`${day}_start` as keyof SchoolSettings, e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`${day}_end`} className="text-xs">End</Label>
                  <Input
                    id={`${day}_end`}
                    type="time"
                    value={settings[`${day}_end` as keyof SchoolSettings] as string}
                    onChange={(e) => handleInputChange(`${day}_end` as keyof SchoolSettings, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                type="url"
                value={settings.logo_url}
                onChange={(e) => handleInputChange('logo_url', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motto">School Motto</Label>
              <Input
                id="motto"
                value={settings.motto}
                onChange={(e) => handleInputChange('motto', e.target.value)}
                placeholder="Enter school motto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary_color"
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={settings.primary_color}
                    onChange={(e) => handleInputChange('primary_color', e.target.value)}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary_color"
                    type="color"
                    value={settings.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={settings.secondary_color}
                    onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                    placeholder="#64748b"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg">Save All Settings</Button>
        </div>
      </form>
    </div>
  )
}

