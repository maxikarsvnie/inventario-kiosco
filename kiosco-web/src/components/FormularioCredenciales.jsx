import { useRef, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.js"
import { validarCredenciales } from "../utils/validaciones.js"
import Mensaje from "./Mensaje.jsx"

// Un solo formulario para Login y Registro (el "extra" de la presentación 09)
function FormularioCredenciales({ esRegistro }) {
    const { usuario, login, registro } = useAuth()
    const navigate = useNavigate()

    const [datos, setDatos] = useState({ nombre: "", email: "", password: "" })
    const [errores, setErrores] = useState({})
    const [errorApi, setErrorApi] = useState(null)
    const [enviando, setEnviando] = useState(false)

    const nombreRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)

    // Si ya hay sesión, esta pantalla no tiene sentido
    if (usuario) {
        return <Navigate to="/productos" replace />
    }

    function manejarCambio(e) {
        const { name, value } = e.target
        setDatos(anteriores => ({ ...anteriores, [name]: value }))
    }

    async function manejarEnvio(e) {
        e.preventDefault()
        setErrorApi(null)

        const nuevosErrores = validarCredenciales(datos, esRegistro)
        setErrores(nuevosErrores)

        // Lleva el foco al primer campo con error
        if (nuevosErrores.nombre) return nombreRef.current.focus()
        if (nuevosErrores.email) return emailRef.current.focus()
        if (nuevosErrores.password) return passwordRef.current.focus()

        try {
            setEnviando(true)
            if (esRegistro) {
                await registro({ nombre: datos.nombre.trim(), email: datos.email.trim(), password: datos.password })
            } else {
                await login({ email: datos.email.trim(), password: datos.password })
            }
            navigate("/productos")
        } catch (err) {
            setErrorApi(err.message)   // por ejemplo: "Email o contraseña incorrectos"
            setEnviando(false)
        }
    }

    return (
        <section className="tarjeta tarjeta-angosta">
            <h1>{esRegistro ? "Crear cuenta" : "Ingresar"}</h1>

            {errorApi && <Mensaje tipo="error">{errorApi}</Mensaje>}

            <form onSubmit={manejarEnvio} noValidate className="formulario">
                {esRegistro && (
                    <div className="campo">
                        <label htmlFor="nombre">Nombre</label>
                        <input id="nombre" name="nombre" ref={nombreRef}
                            value={datos.nombre} onChange={manejarCambio} />
                        {errores.nombre && <span className="campo-error">{errores.nombre}</span>}
                    </div>
                )}

                <div className="campo">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" ref={emailRef}
                        value={datos.email} onChange={manejarCambio} />
                    {errores.email && <span className="campo-error">{errores.email}</span>}
                </div>

                <div className="campo">
                    <label htmlFor="password">Contraseña</label>
                    <input id="password" name="password" type="password" ref={passwordRef}
                        value={datos.password} onChange={manejarCambio} />
                    {errores.password && <span className="campo-error">{errores.password}</span>}
                </div>

                <button type="submit" disabled={enviando}>
                    {enviando ? "Enviando…" : esRegistro ? "Crear cuenta" : "Ingresar"}
                </button>
            </form>

            <p className="pie">
                {esRegistro
                    ? <>¿Ya tenés cuenta? <Link to="/login">Ingresá</Link></>
                    : <>¿No tenés cuenta? <Link to="/registro">Registrate</Link></>}
            </p>
        </section>
    )
}

export default FormularioCredenciales