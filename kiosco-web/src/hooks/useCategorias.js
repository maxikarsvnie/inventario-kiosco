import { useEffect, useState } from "react"
import * as categoriasService from "../services/categorias.js"

export function useCategorias() {
    const [categorias, setCategorias] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function cargar() {
            try {
                setCategorias(await categoriasService.listar())
            } catch (err) {
                setError(err.message)
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [])

    // Después de cada cambio pedimos la lista otra vez (así queda ordenada por nombre)
    async function crear(categoria) {
        await categoriasService.crear(categoria)
        setCategorias(await categoriasService.listar())
    }

    async function actualizar(id, categoria) {
        await categoriasService.actualizar(id, categoria)
        setCategorias(await categoriasService.listar())
    }

    async function eliminar(id) {
        await categoriasService.eliminar(id)
        setCategorias(anteriores => anteriores.filter(c => c.id !== id))
    }

    return { categorias, cargando, error, crear, actualizar, eliminar }
}