const fs = require('fs')
const https = require('https')
const path = require('path')
const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()
const app = express()
const PORT = process.env.PORT || 4000

// import fs from 'fs';
// import path from 'path';

const DATA_FILE = path.resolve('./roles_usuarios.json');

app.use(cors())
app.use(express.json())

// Initialize SQLite DB file in server/ (database.sqlite)
const DB_PATH = path.join(__dirname, 'database.sqlite')
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) return console.error('Failed to open DB', err.message)
  console.log('Opened SQLite DB at', DB_PATH)
})

// Create users table if not exists and seed sample users
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    name TEXT,
    email TEXT
  )`)

  // Insert sample users only if table is empty
  db.get('SELECT COUNT(1) AS count FROM users', (err, row) => {
    if (err) return console.error('DB count error', err.message)
    if (row.count === 0) {
      const stmt = db.prepare('INSERT INTO users (username, name, email) VALUES (?, ?, ?)')
      stmt.run('alice', 'Alice Example', 'alice@example.com')
      stmt.run('bob', 'Bob Example', 'bob@example.com')
      stmt.finalize()
      console.log('Seeded users table')
    }
  })
})

app.get('/api/users', (req, res) => {
  db.all('SELECT id, username, name, email FROM users', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message })
    res.json(rows)
  })
})

app.get('/api/users/:id', (req, res) => {
  const id = Number(req.params.id)
  db.get('SELECT id, username, name, email FROM users WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message })
    if (!row) return res.status(404).json({ error: 'User not found' })
    res.json(row)
  })
})

app.post('/api/v1/usuarios/roles', (req, res) => {
  const { usuarioId, roles } = req.body;
  const userId = Number(usuarioId);

  // 1. Validaciones de los datos recibidos desde React
  if (!userId) {
    return res.status(400).json({ error: 'El campo usuarioId es requerido y debe ser numérico.' });
  }
  if (!roles || !Array.isArray(roles)) {
    return res.status(400).json({ error: 'El campo roles debe ser un arreglo.' });
  }

  // 2. Aquí iría la lógica de persistencia de tu base de datos
  console.log(`Actualizando roles para el usuario ${userId}:`, roles);

  try {
    // 1. Leer el archivo JSON actual (si no existe, empezamos con un objeto vacío)
    let dbTemporal = {};
    if (fs.existsSync(DATA_FILE)) {
      dbTemporal = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }

    // 2. Asignar los nuevos roles al usuario dentro del objeto
    dbTemporal[userId] = roles;

    // 3. Escribir los cambios de vuelta en el archivo de texto
    fs.writeFileSync(DATA_FILE, JSON.stringify(dbTemporal, null, 2));

    res.json({ ok: true, message: 'Data guardada localmente en archivo JSON.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al escribir el archivo: ' + err.message });
  }

  // 3. Respuesta exitosa simulada
  res.json({
    ok: true,
    message: 'Roles actualizados correctamente.',
    totalActualizados: roles.length
  });
});


// Endpoint para Liveness (Saber si el proceso sigue vivo)
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() })
})

// Endpoint para Readiness (Saber si ya puede recibir tráfico / consultas de red)
app.get('/ready', (req, res) => {
  // Validamos si la conexión a la base de datos está activa ejecutando una consulta simple
  db.get('SELECT 1', (err) => {
    if (err) {
      // Si la base de datos falla, devolvemos un código 500 para que K8s detenga el tráfico a este Pod
      return res.status(500).json({ status: 'ERROR', message: 'Database connection failed' })
    }
    res.status(200).json({ status: 'READY' })
  })
})

// Attempt to start HTTPS server using certs/localhost-*.pem
try {
  // certs are placed at project root ./certs; server CWD is server/, so go up one level
  // const key = fs.readFileSync(path.join(__dirname, '..', 'certs', 'localhost-key.pem'))
  // const cert = fs.readFileSync(path.join(__dirname, '..', 'certs', 'localhost-cert.pem'))

  const key = fs.readFileSync(path.join(__dirname, '..', 'key.pem'))
  const cert = fs.readFileSync(path.join(__dirname, '..', 'cert.pem'))

  https.createServer({ key, cert }, app).listen(PORT, () => {
    console.log(`Auth backend listening (HTTPS) on port ${PORT}`)
  })
} catch (e) {
  // Fallback to HTTP if certs are missing or fail to load
  console.warn('Failed to start HTTPS server, falling back to HTTP:', e.message)
  app.listen(PORT, () => {
    console.log(`Auth backend listening (HTTP) on port ${PORT}`)
  })
}
