import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from './auth/msalAdapter.jsx'
import { msalConfig } from './authConfig'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_MSAL === 'true'
const msalInstance = USE_MOCK ? null : new PublicClientApplication(msalConfig)

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>
)
