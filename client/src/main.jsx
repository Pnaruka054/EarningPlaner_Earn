import './index.css'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ErrorBoundar from './website/components/ErrorBoundary/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <ErrorBoundar>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundar>
  </GoogleOAuthProvider>
)
