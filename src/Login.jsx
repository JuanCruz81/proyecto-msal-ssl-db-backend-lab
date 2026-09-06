import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' // <-- Importamos el hook de navegación
import { useMsal } from './auth/msalAdapter.jsx'
import { loginRequest } from './authConfig'
import { useMiContexto } from './miContexto.jsx'



function SignInButton() {
  const { instance } = useMsal()
  const handleLogin = async () => {
    try {
      await (instance.loginPopup ? instance.loginPopup(loginRequest) : instance.loginPopup())
    } catch (e) { console.error(e) }
  }
  return <button onClick={handleLogin}>Sign in con Microsoft</button>
}

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate() // <-- Inicializamos la navegación

  const { actualizarUsername } = useMiContexto() // <-- Usamos el contexto para obtener datos compartidos

  const handleLocalSignIn = (e) => {
    e.preventDefault()

    if (username.trim() !== "" && password.trim() !== "") {
      console.log("Usuario autenticado:", username)
      actualizarUsername(username);
      // REDIRECCIÓN: Cambia la URL del navegador y carga el componente Dashboard
      navigate('/dashboard')
    } else {
      alert("Por favor ingresa un usuario y contraseña")
    }
  }

  return (
    <div className="app">
      <p>No estás autenticado.</p>

      <form onSubmit={handleLocalSignIn} className="login-form">
        <div className="input-group">
          <label htmlFor="username" className="login-label">Usuario / Correo:</label>
          <input
            type="text"
            id="username"
            className="login-input"
            placeholder="nombre@ejemplo.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password" className="login-label">Contraseña:</label>
          <input
            type="password"
            id="password"
            className="login-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-submit-btn">
          Ingresar
        </button>
      </form>

      <div className="login-divider">— Ó —</div>
      <SignInButton />
    </div>
  )
}
