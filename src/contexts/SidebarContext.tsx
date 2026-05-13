'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

type SidebarContextType = {
  collapsed: boolean
  setCollapsed: (value: boolean) => void
  toggleCollapsed: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const loadCollapsedState = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('sidebar_collapsed')
          .eq('id', user.id)
          .single()
        if (data?.sidebar_collapsed !== undefined) {
          setCollapsed(data.sidebar_collapsed)
        }
      }
      setLoaded(true)
    }
    loadCollapsedState()
  }, [user])

  const updateCollapsed = async (value: boolean) => {
    setCollapsed(value)
    if (user) {
      await supabase
        .from('profiles')
        .update({ sidebar_collapsed: value })
        .eq('id', user.id)
    }
  }

  const toggleCollapsed = () => updateCollapsed(!collapsed)

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed: updateCollapsed, toggleCollapsed }}>
      {loaded ? children : null}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return context
}