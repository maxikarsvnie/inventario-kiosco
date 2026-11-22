import { useState } from "react"
import { Link } from "react-router-dom"
import { useProductos } from "../hooks/useProductos.js"
import Mensaje from "../components/Mensaje.jsx"

function Productos() {
    const { productos, stockBajo, minimo, cargando, error, eliminar } = useProductos()
    const [errorAccion, setErrorAccion] = useState(null)

    async function manejarEliminar(producto) {
        if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return
        try {
            setErrorAccion(null)
            await eliminar(producto.id)
        } catch (err) {
            setErrorAccion(err.message)
        }
    }

    if (cargando) return <Mensaje>Cargando productos…</Mensaje>
    if (error) return <Mensaje tipo="error">{error}</Mensaje>

    return (
        <section className="tarjeta">
            <div className="encabezado">
                <h1>Productos</h1>
                <Link className="boton" to="/productos/nuevo">+ Nuevo producto</Link>
            </div>

            {/* ALERTA DE STOCK BAJO */}
            {stockBajo.length > 0 && (
                <div className="alerta">
                    <strong>⚠️ Stock bajo (menos de {minimo} unidades):</strong>
                    <ul>
                        {stockBajo.map(p => (
                            <li key={p.id}>
                                <Link to={`/productos/${p.id}`}>{p.nombre}</Link>: quedan {p.stock}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {errorAccion && <Mensaje tipo="error">{errorAccion}</Mensaje>}

            {productos.length === 0 ? (
                <Mensaje>Todavía no cargaste productos.</Mensaje>
            ) : (
                <table className="tabla">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map(p => (
                            <tr key={p.id} className={p.stock < minimo ? "fila-alerta" : ""}>
                                <td><Link to={`/productos/${p.id}`}>{p.nombre}</Link></td>
                                <td>{p.categoria}</td>
                                {/* precio llega como texto ("850.50"): lo convertimos para formatearlo */}
                                <td>${Number(p.precio).toFixed(2)}</td>
                                <td>{p.stock}</td>
                                <td>
                                    <button className="btn-peligro btn-chico" onClick={() => manejarEliminar(p)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    )
}

export default Productos