import { useState } from "react"
import { Link } from "react-router-dom"
import { useProductos } from "../hooks/useProductos.js"
import Mensaje from "../components/Mensaje.jsx"

// Pasa a minúsculas y saca las tildes: "Café" → "cafe"
function normalizar(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

// Muestra el precio en formato argentino: 1000 → "$ 1.000,00"
function formatearPrecio(precio) {
    return Number(precio).toLocaleString("es-AR", { style: "currency", currency: "ARS" })
}

function Productos() {
    const { productos, stockBajo, minimo, cargando, error, eliminar, ajustarStock } = useProductos()
    const [errorAccion, setErrorAccion] = useState(null)

    // Estado de los filtros
    const [busqueda, setBusqueda] = useState("")
    const [categoria, setCategoria] = useState("")
    const [soloStockBajo, setSoloStockBajo] = useState(false)

    async function manejarEliminar(producto) {
        if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return
        try {
            setErrorAccion(null)
            await eliminar(producto.id)
        } catch (err) {
            setErrorAccion(err.message)
        }
    }

    async function manejarAjuste(producto, cantidad) {
        try {
            setErrorAccion(null)
            await ajustarStock(producto.id, cantidad)
        } catch (err) {
            setErrorAccion(err.message)   // por ejemplo: "No hay stock suficiente"
        }
    }

    function limpiarFiltros() {
        setBusqueda("")
        setCategoria("")
        setSoloStockBajo(false)
    }

    if (cargando) return <Mensaje>Cargando productos…</Mensaje>
    if (error) return <Mensaje tipo="error">{error}</Mensaje>

    // Categorías que tienen productos, sin repetir y en orden alfabético
    const categorias = [...new Set(productos.map(p => p.categoria))].sort()

    // Se aplican los tres filtros. No se pide nada a la API:
    // los productos ya están cargados, solo elegimos cuáles mostrar.
    const texto = normalizar(busqueda.trim())
    const filtrados = productos.filter(p => {
        if (texto && !normalizar(p.nombre).includes(texto)) return false
        if (categoria && p.categoria !== categoria) return false
        if (soloStockBajo && p.stock >= minimo) return false
        return true
    })

    const hayFiltros = texto !== "" || categoria !== "" || soloStockBajo

    return (
        <section className="tarjeta">
            <div className="encabezado">
                <h1>Productos</h1>
                <Link className="boton" to="/productos/nuevo">+ Nuevo producto</Link>
            </div>

            {/* ALERTA DE STOCK BAJO (una sola línea) */}
            {stockBajo.length > 0 && (
                <div className="alerta alerta-compacta">
                    <span>
                        ⚠️ <strong>{stockBajo.length}</strong>{" "}
                        {stockBajo.length === 1 ? "producto tiene" : "productos tienen"} stock bajo
                        (menos de {minimo} unidades)
                    </span>
                    <button className="btn-secundario btn-chico" onClick={() => setSoloStockBajo(!soloStockBajo)}>
                        {soloStockBajo ? "Ver todos" : "Ver solo esos"}
                    </button>
                </div>
            )}

            {/* FILTROS */}
            {productos.length > 0 && (
                <div className="filtros">
                    <input
                        type="search"
                        placeholder="🔍 Buscar producto…"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        aria-label="Buscar producto"
                    />
                    <select value={categoria} onChange={e => setCategoria(e.target.value)} aria-label="Filtrar por categoría">
                        <option value="">Todas las categorías</option>
                        {categorias.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <label className="check">
                        <input
                            type="checkbox"
                            checked={soloStockBajo}
                            onChange={e => setSoloStockBajo(e.target.checked)}
                        />
                        Solo stock bajo
                    </label>
                    {hayFiltros && (
                        <button className="btn-secundario btn-chico" onClick={limpiarFiltros}>Limpiar</button>
                    )}
                </div>
            )}

            {errorAccion && <Mensaje tipo="error">{errorAccion}</Mensaje>}

            {productos.length === 0 ? (
                <Mensaje>Todavía no cargaste productos.</Mensaje>
            ) : filtrados.length === 0 ? (
                <Mensaje>Ningún producto coincide con los filtros.</Mensaje>
            ) : (
                <>
                    <p className="contador">Mostrando {filtrados.length} de {productos.length} productos</p>
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
                            {filtrados.map(p => (
                                <tr key={p.id} className={p.stock < minimo ? "fila-alerta" : ""}>
                                    <td><Link to={`/productos/${p.id}`}>{p.nombre}</Link></td>
                                    <td>{p.categoria}</td>
                                    <td>{formatearPrecio(p.precio)}</td>
                                    <td>
                                        <div className="stock">
                                            <button className="btn-secundario btn-chico" title="Vender 1"
                                                onClick={() => manejarAjuste(p, -1)} disabled={p.stock === 0}>−</button>
                                            <span>{p.stock}</span>
                                            <button className="btn-secundario btn-chico" title="Reponer 1"
                                                onClick={() => manejarAjuste(p, 1)}>+</button>
                                        </div>
                                    </td>
                                    <td>
                                        <button className="btn-peligro btn-chico" onClick={() => manejarEliminar(p)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </section>
    )
}

export default Productos