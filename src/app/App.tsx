import { lazy } from 'react'
import { useLocation } from './hooks/useClient'
import { TranslationProvider } from './contexts/TranslationProvider'
import { QueryClientProvider } from './contexts/QueryClientProvider'
import { ThemeProvider } from '@zendeskgarden/react-theming'

const TicketSideBar = lazy(() => import('./locations/TicketSideBar'))
const Modal = lazy(() => import('./locations/Modal'))

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
