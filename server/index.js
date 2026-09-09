const fs = require('fs')
const https = require('https')
const path = require('path')
const express = require('express')
const cors = require('cors')
// 1. Importamos el cliente de Supabase y dotenv
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// 2. Inicializamos el cliente de Supabase usando tus variables del archivo .env
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

console.log('Conectado exitosamente al cliente de Supabase')

// OBTENER TODOS LOS USUARIOS
app.get('/api/users', async (req, res) => {
  try {
    // Reemplaza 'users' por el nombre exacto de tu tabla en Supabase
    const { data, error } = await supabase
      .from('users')
      .select('username, name, email')

    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// OBTENER UN USUARIO POR ID
app.get('/api/users/:id', async (req, res) => {
  const id = Number(req.params.id)
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, name, email')
      .eq('id', id)
      .single() // Trae un solo objeto en vez de un arreglo

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'User not found' })
      throw error
    }

    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GUARDAR O ACTUALIZAR ROLES DE USUARIO
app.post('/api/v1/usuarios/roles', async (req, res) => {
  const { usuarioId, roles } = req.body;
  const userId = Number(usuarioId);

  if (!userId) {
    return res.status(400).json({ error: 'El campo usuarioId es requerido y debe ser numérico.' });
  }
  if (!roles || !Array.isArray(roles)) {
    return res.status(400).json({ error: 'El campo roles debe ser un arreglo.' });
  }

  try {
    // Insertamos o actualizamos los roles en tu tabla de Supabase.
    // .upsert() inserta si no existe el id, o lo actualiza si ya existe.
    // Nota: Tu tabla en Supabase debe llamarse 'roles_usuarios' (o como prefieras) y tener las columnas 'user_id' y 'roles'.
    const { data, error } = await supabase
      .from('roles_usuarios') 
      .upsert({ user_id: userId, roles: roles })
      .select()

    if (error) throw error

    res.json({
      ok: true,
      message: 'Roles actualizados correctamente en Supabase.',
      totalActualizados: roles.length,
      data: data
    });

  } catch (err) {
    res.status(500).json({ error: 'Error al guardar en Supabase: ' + err.message });
  }
});

// Endpoint para Liveness (Saber si el proceso sigue vivo)
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() })
})

// Endpoint para Readiness (Modificado para validar Supabase)
app.get('/ready', async (req, res) => {
  try {
    // Hacemos una consulta rápida a cualquier tabla o una función del sistema para verificar la conexión
    const { error } = await supabase.from('users').select('id').limit(1)
    if (error) throw error

    res.status(200).json({ status: 'READY' })
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: 'Supabase connection failed: ' + err.message })
  }
})

// Servidor HTTPS / HTTP Fallback (Mantenemos tu lógica intacta)
try {
  const key = fs.readFileSync(path.join(__dirname, '..', 'key.pem'))
  const cert = fs.readFileSync(path.join(__dirname, '..', 'cert.pem'))

  https.createServer({ key, cert }, app).listen(PORT, () => {
    console.log(`Auth backend listening (HTTPS) on port ${PORT}`)
  })
} catch (e) {
  console.warn('Failed to start HTTPS server, falling back to HTTP:', e.message)
  app.listen(PORT, () => {
    console.log(`Auth backend listening (HTTP) on port ${PORT}`)
  })
}
