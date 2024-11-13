'use client'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface TanstackProviderProps {
  children: React.ReactNode
}

export default function TanstackProvider({ children }: TanstackProviderProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}