import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.js"

function RutaProtegida() {
    const { usuario } = useAuth()

    // Sin sesión → al login. "replace" evita que el botón Atrás vuelva acá
    if (!usuario) {
        return <Navigate to="/login" replace />
    }

    // Con sesión → muestra la página que corresponda
    return <Outlet />
}

export default RutaProtegida