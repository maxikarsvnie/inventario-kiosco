import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { validarProducto } from "../utils/validaciones.js"
import Mensaje from "./Mensaje.jsx"

const PRODUCTO_VACIO = { nombre: "", precio: "", stock: "", categoriaId: "" }

// Formulario de alta y de edición de productos, con validación por campo.
// onGuardar es la función que recibe los datos limpios (la decide cada página).
function FormularioProducto({ inicial = PRODUCTO_VACIO, categorias, onGuardar, textoBoton }) {
    const [datos, setDatos] = useState(inicial)
    const [errores, setErrores] = useState({})
    const [errorApi, setErrorApi] = useState(null)
    const [guardando, setGuardando] = useState(false)

    const nombreRef = useRef(null)
    const precioRef = useRef(null)
    const stockRef = useRef(null)
    const categoriaRef = useRef(null)

    function manejarCambio(e) {
        const { name, value } = e.target
        setDatos(anteriores => ({ ...anteriores, [name]: value }))
    }

    async function manejarEnvio(e) {
        e.preventDefault()
        setErrorApi(null)

        const nuevosErrores = validarProducto(datos)
        setErrores(nuevosErrores)

        // Lleva el foco al primer campo con error
        if (nuevosErrores.nombre) return nombreRef.current.focus()
        if (nuevosErrores.precio) return precioRef.current.focus()
        if (nuevosErrores.stock) return stockRef.current.focus()
        if (nuevosErrores.categoriaId) return categoriaRef.current.focus()

        try {
            setGuardando(true)
            await onGuardar({
                nombre: datos.nombre.trim(),
                precio: Number(datos.precio),
                stock: Number(datos.stock),
                categoriaId: Number(datos.categoriaId)
            })
        } catch (err) {
            setErrorApi(err.message)   // por ejemplo: "La categoria elegida no existe"
            setGuardando(false)
        }
    }

    // Sin categorías no se puede crear un producto
    if (categorias.length === 0) {
        return (
            <Mensaje>
                Primero tenés que <Link to="/categorias">crear al menos una categoría</Link>.
            </Mensaje>
        )
    }

    return (
        <form onSubmit={manejarEnvio} noValidate className="formulario">
            {errorApi && <Mensaje tipo="error">{errorApi}</Mensaje>}

            <div className="campo">
                <label htmlFor="nombre">Nombre *</label>
                <input id="nombre" name="nombre" ref={nombreRef}
                    value={datos.nombre} onChange={manejarCambio} />
                {errores.nombre && <span className="campo-error">{errores.nombre}</span>}
            </div>

            <div className="fila">
                <div className="campo">
                    <label htmlFor="precio">Precio *</label>
                    <input id="precio" name="precio" type="number" step="0.01" ref={precioRef}
                        value={datos.precio} onChange={manejarCambio} />
                    {errores.precio && <span className="campo-error">{errores.precio}</span>}
                </div>

                <div className="campo">
                    <label htmlFor="stock">Stock *</label>
                    <input id="stock" name="stock" type="number" ref={stockRef}
                        value={datos.stock} onChange={manejarCambio} />
                    {errores.stock && <span className="campo-error">{errores.stock}</span>}
                </div>
            </div>

            <div className="campo">
                <label htmlFor="categoriaId">Categoría *</label>
                <select id="categoriaId" name="categoriaId" ref={categoriaRef}
                    value={datos.categoriaId} onChange={manejarCambio}>
                    <option value="">— Elegí una categoría —</option>
                    {categorias.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
                {errores.categoriaId && <span className="campo-error">{errores.categoriaId}</span>}
            </div>

            <button type="submit" disabled={guardando}>
                {guardando ? "Guardando…" : textoBoton}
            </button>
        </form>
    )
}

export default FormularioProducto