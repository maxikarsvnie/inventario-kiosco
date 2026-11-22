import { useEffect, useState } from "react"
import * as productosService from "../services/productos.js"

// Hook propio: encapsula la lista de productos, la alerta de stock bajo,
// el estado de carga y el de error. Devuelve datos y acciones, nunca JSX.
export function useProductos() {
    const [productos, setProductos] = useState([])
    const [stockBajo, setStockBajo] = useState([])
    const [minimo, setMinimo] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function cargar() {
            try {
                // Los dos pedidos salen a la vez y esperamos a que terminen ambos
                const [lista, alerta] = await Promise.all([
                    productosService.listar(),
                    productosService.stockBajo()
                ])
                setProductos(lista)
                setStockBajo(alerta.productos)
                setMinimo(alerta.minimo)
            } catch (err) {
                setError(err.message)
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [])

    // No atrapa el error: lo deja subir para que la página decida cómo mostrarlo
    async function eliminar(id) {
        await productosService.eliminar(id)
        setProductos(anteriores => anteriores.filter(p => p.id !== id))
        setStockBajo(anteriores => anteriores.filter(p => p.id !== id))
    }

    return { productos, stockBajo, minimo, cargando, error, eliminar }
}