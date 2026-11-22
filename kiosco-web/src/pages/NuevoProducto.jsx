import { useNavigate } from "react-router-dom"
import { useCategorias } from "../hooks/useCategorias.js"
import * as productosService from "../services/productos.js"
import FormularioProducto from "../components/FormularioProducto.jsx"
import Mensaje from "../components/Mensaje.jsx"

function NuevoProducto() {
    const navigate = useNavigate()
    const { categorias, cargando, error } = useCategorias()

    // Se ejecuta cuando el formulario ya validó los datos
    async function guardar(producto) {
        await productosService.crear(producto)
        navigate("/productos")   // recién después de que la API confirmó
    }

    if (cargando) return <Mensaje>Cargando…</Mensaje>
    if (error) return <Mensaje tipo="error">{error}</Mensaje>

    return (
        <section className="tarjeta">
            <h1>Nuevo producto</h1>
            <FormularioProducto categorias={categorias} onGuardar={guardar} textoBoton="Agregar producto" />
        </section>
    )
}

export default NuevoProducto