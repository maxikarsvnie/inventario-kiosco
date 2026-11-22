import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useCategorias } from "../hooks/useCategorias.js"
import * as productosService from "../services/productos.js"
import FormularioProducto from "../components/FormularioProducto.jsx"
import Mensaje from "../components/Mensaje.jsx"

function DetalleProducto() {
    const { id } = useParams()   // ojo: llega como texto ("3")
    const navigate = useNavigate()
    const { categorias, cargando: cargandoCategorias } = useCategorias()

    const [producto, setProducto] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    // Depende de [id]: si se navega a otro producto, se vuelve a pedir
    useEffect(() => {
        async function cargar() {
            try {
                setProducto(await productosService.obtener(id))
            } catch (err) {
                setError(err.message)
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [id])

    async function guardar(datos) {
        await productosService.actualizar(id, datos)
        navigate("/productos")
    }

    async function eliminar() {
        if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return
        try {
            await productosService.eliminar(id)
            navigate("/productos")
        } catch (err) {
            setError(err.message)
        }
    }

    if (cargando || cargandoCategorias) return <Mensaje>Cargando…</Mensaje>

    if (!producto) {
        return (
            <section className="tarjeta">
                <Mensaje tipo="error">{error ?? "Producto no encontrado"}</Mensaje>
                <Link to="/productos">← Volver a la lista</Link>
            </section>
        )
    }

    // Convertimos lo que vino de la API al formato del formulario (todo texto)
    const inicial = {
        nombre: producto.nombre,
        precio: String(producto.precio),
        stock: String(producto.stock),
        categoriaId: String(producto.categoria_id)
    }

    return (
        <section className="tarjeta">
            <Link to="/productos">← Volver a la lista</Link>
            <h1>{producto.nombre}</h1>

            {error && <Mensaje tipo="error">{error}</Mensaje>}

            <FormularioProducto inicial={inicial} categorias={categorias}
                onGuardar={guardar} textoBoton="Guardar cambios" />

            <button className="btn-peligro" onClick={eliminar}>Eliminar producto</button>
        </section>
    )
}

export default DetalleProducto