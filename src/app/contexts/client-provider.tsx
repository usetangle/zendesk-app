import React, { useMemo, useState, useEffect, createContext } from 'react'
export const ClientContext = createContext<ReturnType<typeof window.ZAFClient.init> | null>(null)

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => window.ZAFClient.init(), [])
  const [appRegistered, setAppRegistered] = useState(false)

  useEffect(() => {
    client.on('app.registered', function () {
      setAppRegistered(true)
    })
  }, [client])

  if (!appRegistered) return null

  return <ClientContext.Provider value={client}>{children}</ClientContext.Provider>
}
