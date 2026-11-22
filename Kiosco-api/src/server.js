import "dotenv/config"
import express from "express"
import cors from "cors"
import CategoriaRoutes from "./routes/CategoriaRoutes.js"
import ProductoRoutes from "./routes/ProductoRoutes.js"
import AuthRoutes from "./routes/AuthRoutes.js"

const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL
}))

app.use(express.json())

// Rutas de la api
app.use("/api/categorias", CategoriaRoutes)
app.use("/api/productos", ProductoRoutes)
app.use("/api/auth", AuthRoutes)

// Manejo de rutas inexistentes
app.use((req, res) => {
    res.status(404).json({
        error: "Ruta no encontrada"
    })
})

// Manejo de errores internos
app.use((error, req, res, next) => {
    console.error(error)

    res.status(500).json({
        error: "Error interno del servidor"
    })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`)
})