import ReactDOM from 'react-dom/client'
import App from './app.jsx'
import { ClientProvider } from './contexts/client-provider.jsx'
import '@zendeskgarden/css-bedrock'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ClientProvider>
    <App />
  </ClientProvider>
)
