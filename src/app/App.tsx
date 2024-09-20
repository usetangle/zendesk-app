import { lazy } from 'react'
import { useLocation } from './hooks/use-client'
import { TranslationProvider } from './contexts/translation-provider'
import { QueryClientProvider } from './contexts/query-client-provider'
import { ThemeProvider } from '@zendeskgarden/react-theming'

const TicketSideBar = lazy(() => import('./locations/ticket-sidebar'))
const Modal = lazy(() => import('./locations/modal'))

const LOCATIONS = {
  ticket_sidebar: TicketSideBar,
  modal: Modal,
  default: () => null
}

function App() {
  const location = useLocation()
  const Location = LOCATIONS[location as keyof typeof LOCATIONS] || LOCATIONS.default

  return (
    <ThemeProvider>
      <TranslationProvider>
        <QueryClientProvider>
          <Location />
        </QueryClientProvider>
      </TranslationProvider>
    </ThemeProvider>
  )
}

export default App
