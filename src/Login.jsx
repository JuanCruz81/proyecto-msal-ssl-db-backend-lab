import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom' 
import { useMsal } from './auth/msalAdapter.jsx'
import { loginRequest } from './authConfig'
import { useMiContexto } from './miContexto.jsx'

// 🔑 AGREGA TU LLAVE PÚBLICA ANON AQUÍ (La encuentras en settings > API > anon public)
// const SUPABASE_ANON_KEY = "TU_LLAVE_ANON_PUBLICA_AQUI" 
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY; 

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
  const [cargando, setCargando] = useState(false) 
  const navigate = useNavigate() 

  const { actualizarUsername } = useMiContexto() 

  const handleLocalSignIn = async (e) => {
    e.preventDefault()

    if (username.trim() === "" || password.trim() === "") {
      alert("Por favor ingresa un usuario y contraseña")
      return
    }

    try {
      setCargando(true)

      // 1. Fetch directo al endpoint de Supabase configurando los Headers correctos
      const respuesta = await fetch('https://qnocnvmuuzxrfyqyhlng.supabase.co/rest/v1/users', {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!respuesta.ok) throw new Error('Error al conectar con el servidor de Supabase')
      
      const usuariosbd = await respuesta.json()

      // 2. Buscar si el 'username' ingresado existe en la lista de Supabase
      const usuarioEncontrado = usuariosbd.find(
        (u) => u.username?.toLowerCase() === username?.trim().toLowerCase()
      )

      if (usuarioEncontrado) {
        console.log("Usuario verificado en Supabase:", usuarioEncontrado)
        
        actualizarUsername(usuarioEncontrado.name || usuarioEncontrado.username)
        navigate('/dashboard')
      } else {
        alert("El usuario ingresado no existe en la base de datos.")
      }

    } catch (error) {
      console.error("Error en el login:", error)
      alert("Hubo un problema al validar tus datos. Inténtalo más tarde.")
    } finally {
      setCargando(false) 
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
            placeholder="alice o bob" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={cargando}
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
            disabled={cargando}
            required
          />
        </div>

        <button type="submit" className="login-submit-btn" disabled={cargando}>
          {cargando ? 'Verificando...' : 'Ingresar'}
        </button>
      </form>

      <div className="login-divider">— Ó —</div>
      <SignInButton />
    </div>
  )
}
