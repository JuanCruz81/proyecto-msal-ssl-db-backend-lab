import React from 'react'
import { useMsal } from './auth/msalAdapter.jsx'
import { loginRequest } from './authConfig'

function SignInButton(){
  const { instance } = useMsal()
  const handleLogin = async () => {
    try { await (instance.loginPopup ? instance
        .loginPopup(loginRequest) : instance.loginPopup()) }
    catch(e){ console.error(e) }
  }
  return <button onClick={handleLogin}>Sign in</button>
}

function SignOutButton(){
  const { instance } = useMsal()
  const handleLogout = async () => {
    try { await (instance.logoutPopup ? instance.logoutPopup() : instance.logoutPopup()) }
    catch(e){ console.error(e) }
  }
  return <button onClick={handleLogout}>Sign out</button>
}

export default function App(){
  const { accounts } = useMsal()
  const isAuthenticated = accounts && accounts.length > 0

  return (
    <div className="app">
      <h1>Vite + React + MSAL (dev mock available)</h1>

      {isAuthenticated ? (
        <>
          <p>Estás autenticado como {accounts[0].username || accounts[0].name}</p>
          <SignOutButton />
        </>
      ) : (
        <>
          <p>No estás autenticado.</p>
          <SignInButton />
        </>
      )}
    </div>
  )
}
