import { ReactNode, useEffect, useState } from 'react'

export const DelayedRender = ({ children }: { children: ReactNode }) => {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShouldRender(true), 10 * 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!shouldRender) {
    throw new Promise(() => {})
  }

  return <>{children}</>
}
