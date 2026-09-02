import { defineConfig } from 'vite'
import fs from 'fs'

export default defineConfig(({ mode }) => {
  const port = Number(process.env.VITE_PORT) || 5173
  let httpsConfig = false
  try {
    const key = fs.readFileSync('./certs/localhost-key.pem')
    const cert = fs.readFileSync('./certs/localhost-cert.pem')
    httpsConfig = { key, cert }
  } catch (e) {
    // leave httpsConfig as false
  }

  return {
    server: {
      https: httpsConfig,
      port
    }
  }
})
