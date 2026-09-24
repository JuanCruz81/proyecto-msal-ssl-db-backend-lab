const fs = require('fs')
const https = require('https')
const path = require('path')
const express = require('express')
const cors = require('cors')
// 1. Importamos el cliente de Supabase y dotenv
const { createClient } = require('@supabase/supabase-js')
const { Server } = require('socket.io')
const { notifyDiscord } = require('./botHelper.js')
const { iniciarSimuladorChat } = require('./simuladorChat.js')

// === NUEVA CONFIGURACIÓN DE SQLITE ===
const sqlite3 = require('sqlite3').verbose()
const util = require('util')

// Especificamos la ruta correcta al archivo .env directamente
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const PORT = process.env.PORT || 4000

// Abre la conexión al archivo de tu base de datos
// (Asegúrate de que la ruta apunte a donde DBeaver guardó tu archivo .db)
const db = new sqlite3.Database('C:\\Users\\Administrator\\dbeaverConnection\\mibase.db', (err) => {
  if (err) console.error('Error al conectar a SQLite:', err.message)
  else console.log('Conectado con éxito a la base de datos de SQLite.')
})

// Convertimos el método db.all a Promesa para poder usar async/await igual que con Supabase
const dbAll = util.promisify(db.all).bind(db)

app.use(cors())
app.use(express.json())

// 2. Inicializamos el cliente de Supabase usando tus variables del archivo .env
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

console.log('Conectado exitosamente al cliente de Supabase')

let io

// OBTENER TODOS LOS USUARIOS
// app.get('/api/users', async (req, res) => {
//   try {
//     const { data, error } = await supabase
//       .from('users')
//       .select('username, name, email')

//     if (error) throw error
//     res.json(data)
//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// })

// OBTENER TODOS LOS USUARIOS (Versión SQLite)
app.get('/api/users', async (req, res) => {
  try {
    // Ejecutamos la consulta SQL pura. 
    // Recuerda que en el comando CREATE TABLE que ejecutamos usamos 'name' e 'email'.
    const data = await dbAll('SELECT name, email FROM users')

    // Si la tabla está vacía, SQLite te devolverá un array vacío []
    res.json(data)
  } catch (err) {
    // Si hay un error en la consulta o en la base de datos, lo captura aquí
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
      .single()

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
    const { data, error } = await supabase
      .from('roles_usuarios')
      .upsert({ user_id: userId, roles: roles })
      .select()

    if (error) throw error

    // 💡 CORRECCIÓN CRÍTICA: Disparar la notificación cuando ocurra un cambio real
    await sendNotification(userId, roles);

    res.json({
      ok: true,
      message: 'Roles actualizados correctamente en Supabase y notificación enviada.',
      totalActualizados: roles.length,
      data: data
    });

  } catch (err) {
    res.status(500).json({ error: 'Error al guardar en Supabase: ' + err.message });
  }
});

// Endpoint para Liveness
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() })
})

// Endpoint para Readiness
app.get('/ready', async (req, res) => {
  try {
    const { error } = await supabase.from('users').select('id').limit(1)
    if (error) throw error

    res.status(200).json({ status: 'READY' })
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: 'Supabase connection failed: ' + err.message })
  }
})

app.get("/card", (req, res) => {
  const card = {
    type: "AdaptiveCard",
    version: "1.4",
    body: [
      { type: "TextBlock", size: "Large", weight: "Bolder", text: "Pedido aprobado" },
      { type: "TextBlock", text: "El pedido #1234 fue aprobado." }
    ]
  };
  res.json(card);
});

app.post('/api/teams/send', (req, res) => {
  const { title, message } = req.body

  const card = {
    type: 'AdaptiveCard',
    version: '1.4',
    body: [
      { type: 'TextBlock', size: 'Large', weight: 'Bolder', text: title || 'Notificación' },
      { type: 'TextBlock', text: message || '' }
    ]
  }

  if (io) {
    io.emit('teams-notification', card)
  }

  res.json({ success: true, sent: true })
})

// ENDPOINT EXCLUSIVO PARA PROBAR EL ENVÍO DEL WEBHOOK
app.post('/api/v1/test-notification', async (req, res) => {
  try {
    const usuarioId = req.body.usuarioId || 999;
    const roles = req.body.roles || ['Admin_Test', 'Moderador_Test'];

    console.log(`Iniciando prueba de notificación para el usuario: ${usuarioId}`);

    await notifyDiscord(usuarioId, roles);

    res.json({
      success: true,
      message: 'Petición de prueba procesada. Verifica tu canal de chat.',
      datos_enviados: { usuarioId, roles }
    });
  } catch (err) {
    console.error('Error en el endpoint de pruebas:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Servidor HTTPS / HTTP Fallback
try {
  const key = fs.readFileSync(path.join(__dirname, '..', 'key.pem'))
  const cert = fs.readFileSync(path.join(__dirname, '..', 'cert.pem'))

  const server = https.createServer({ key, cert }, app)

  io = new Server(server, {
    cors: { origin: '*' }
  })

  io.on('connection', socket => {
    console.log('Cliente conectado (HTTPS):', socket.id)
  })

  server.listen(PORT, () => {
    console.log(`Auth backend listening (HTTPS) on port ${PORT}`)
    iniciarSimuladorChat();
  })
} catch (e) {
  console.warn('Failed to start HTTPS server, falling back to HTTP:', e.message)
  
  // 💡 OPTIMIZACIÓN: Inicializar HTTP Server de Express adjuntando Socket.io en el fallback
  const httpServer = app.listen(PORT, () => {
    console.log(`Auth backend listening (HTTP) on port ${PORT}`)
  })

  io = new Server(httpServer, {
    cors: { origin: '*' }
  })

  io.on('connection', socket => {
    console.log('Cliente conectado (HTTP):', socket.id)
  })
}
