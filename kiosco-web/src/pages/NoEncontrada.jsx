import { useRef, useState } from "react"
import { useCategorias } from "../hooks/useCategorias.js"
import Mensaje from "../components/Mensaje.jsx"

function Categorias() {
    const { categorias, cargando, error, crear, actualizar, eliminar } = useCategorias()

    const [nombre, setNombre] = useState("")
    const [editandoId, setEditandoId] = useState(null)   // null = estamos creando
    const [errorCampo, setErrorCampo] = useState(null)
    const [errorAccion, setErrorAccion] = useState(null)
    const inputRef = useRef(null)

    function empezarEdicion(categoria) {
        setEditandoId(categoria.id)
        setNombre(categoria.nombre)
        setErrorCampo(null)
        inputRef.current.focus()
    }

    function cancelar() {
        setEditandoId(null)
        setNombre("")
        setErrorCampo(null)
    }

    async function manejarEnvio(e) {
        e.preventDefault()
        setErrorAccion(null)

        if (!nombre.trim()) {
            setErrorCampo("El nombre es obligatorio")
            inputRef.current.focus()
            return
        }
        setErrorCampo(null)

        try {
            if (editandoId) {
                await actualizar(editandoId, { nombre: nombre.trim() })
            } else {
                await crear({ nombre: nombre.trim() })
            }
            cancelar()
        } catch (err) {
            setErrorAccion(err.message)
        }
    }

    async function manejarEliminar(categoria) {
        if (!window.confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) return
        try {
            setErrorAccion(null)
            await eliminar(categoria.id)
        } catch (err) {
            // Acá llega el 409 si la categoría tiene productos
            setErrorAccion(err.message)
        }
    }

    return (
        <section className="tarjeta">
            <h1>Categorías</h1>

            <form onSubmit={manejarEnvio} noValidate className="formulario">
                <div className="campo">
                    <label htmlFor="nombre">{editandoId ? "Editar categoría" : "Nueva categoría"}</label>
                    <input id="nombre" ref={inputRef} value={nombre}
                        onChange={e => setNombre(e.target.value)} />
                    {errorCampo && <span className="campo-error">{errorCampo}</span>}
                </div>
                <div className="acciones">
                    <button type="submit">{editandoId ? "Guardar cambios" : "Agregar"}</button>
                    {editandoId && (
                        <button type="button" className="btn-secundario" onClick={cancelar}>Cancelar</button>
                    )}
                </div>
            </form>

            {errorAccion && <Mensaje tipo="error">{errorAccion}</Mensaje>}
            {error && <Mensaje tipo="error">{error}</Mensaje>}

            {cargando ? (
                <Mensaje>Cargando categorías…</Mensaje>
            ) : categorias.length === 0 ? (
                <Mensaje>Todavía no tenés categorías.</Mensaje>
            ) : (
                <ul className="lista">
                    {categorias.map(c => (
                        <li key={c.id}>
                            <span>{c.nombre}</span>
                            <button className="btn-secundario btn-chico" onClick={() => empezarEdicion(c)}>Editar</button>
                            <button className="btn-peligro btn-chico" onClick={() => manejarEliminar(c)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

export default Categorias