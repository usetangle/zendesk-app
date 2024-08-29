import React from 'react'
import { QueryClient, QueryClientProvider as ReactQueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  return <ReactQueryClientProvider client={queryClient}>{children}</ReactQueryClientProvider>
}
