import React, { createContext, useContext, useState } from 'react'
import { MsalProvider as RealMsalProvider, useMsal as realUseMsal } from '@azure/msal-react'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_MSAL === 'true'
const MsalContext = createContext(null)

function MockMsalProvider({ children }) {
  const [accounts, setAccounts] = useState([])

  const loginPopup = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const res = await fetch(`${apiUrl}/api/users`)
      const list = await res.json()
      if (Array.isArray(list) && list.length > 0) {
        const user = list[0]
        setAccounts([user])
        return { account: user }
      }
      const newAcc = { username: 'dev.local', name: 'Desarrollador local' }
      setAccounts([newAcc])
      return { account: newAcc }
    } catch (e) {
      console.error('Failed to fetch users from backend', e)
      const newAcc = { username: 'dev.local', name: 'Desarrollador local' }
      setAccounts([newAcc])
      return { account: newAcc }
    }
  }

  const logoutPopup = async () => {
    setAccounts([])
  }

  const instance = { loginPopup, logoutPopup }

  return (
    <MsalContext.Provider value={{ instance, accounts }}>
      {children}
    </MsalContext.Provider>
  )
}

function useMockMsal() {
  return useContext(MsalContext) || { instance: { loginPopup: async () => {}, logoutPopup: async () => {} }, accounts: [] }
}

export const MsalProvider = USE_MOCK ? MockMsalProvider : RealMsalProvider
export function useMsal() {
  return USE_MOCK ? useMockMsal() : realUseMsal()
}
