import express from "express"
import cors from "cors"
import 'dotenv/config'
import { connectDB } from "./config/db.js"

import routerCervezas from "./routes/routerCervezas.js"
import routerVinos from "./routes/routerVinos.js"
import authRoutes from "./routes/authRoutes.js"
import routerComandes from "./routes/routerComandes.js"
import routerUsuaris from "./routes/routerUsuaris.js"

const app = express()
const PORT = process.env.PORT || 3001

// ── CORS — permet peticions des del frontend ───────────────────────
// Accepta:
//   1. La URL definida a FRONTEND_URL (variable d'entorn de producció)
//   2. Qualsevol subdomini *.vercel.app (deploys de preview)
//   3. localhost:5173 i 4173 (desenvolupament)
const originsExactes = [
  process.env.FRONTEND_URL,
  'https://vinacoteca-backend-2.onrender.com',
  'http://localhost:3001'
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Peticions sense origen (Postman, curl, server-to-server) → permeses
    if (!origin) return callback(null, true)
    // Origen exacte permès
    if (originsExactes.includes(origin)) return callback(null, true)
    // Qualsevol subdomini *.vercel.app (preview deploys)
    if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return callback(null, true)
    // Bloquejat
    console.warn(`CORS bloquejat per a l'origen: ${origin}`)
    return callback(new Error(`CORS bloquejat per a l'origen: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Middleware per parsejar JSON
app.use(express.json())

// Servir arxius estàtics (fotos pujades) amb headers CORS oberts
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  next()
}, express.static('uploads'))

// Connexió a la base de dades
connectDB()

// Rutes
app.use("/api/cervezas", routerCervezas)
app.use("/api/vinos", routerVinos)
app.use("/api/auth", authRoutes)
app.use("/api/comandes", routerComandes)
app.use("/api/usuaris", routerUsuaris)

// Ruta arrel — útil per comprovar que el servidor està viu
app.get("/", (req, res) => {
  res.json({
    missatge: "Benvingut a l'API de la Vinacoteca 🍷🍺",
    estat: "ok",
    endpoints: {
      auth: "/api/auth (login, registro, perfil)",
      vinos: "/api/vinos",
      cervezas: "/api/cervezas",
      comandes: "/api/comandes",
      usuaris: "/api/usuaris"
    }
  })
})

// 404 handler — qualsevol ruta no trobada
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no trobada: ${req.method} ${req.originalUrl}` })
})

// Error handler global
app.use((err, req, res, next) => {
  console.error('Error global:', err.message)
  res.status(err.status || 500).json({ error: err.message || 'Error intern del servidor' })
})

app.listen(PORT, () => {
  console.log(`✅ Servidor levantado en el puerto ${PORT}`)
  console.log(`🌐 Origens CORS permesos:`, originsExactes)
})
