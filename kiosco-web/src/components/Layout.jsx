import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.js"

function Layout() {
    const { usuario, cerrarSesion } = useAuth()
    const navigate = useNavigate()

    function salir() {
        cerrarSesion()
        navigate("/")          // después de salir, vuelve al inicio
    }

    return (
        <>
            <header className="barra">
                <Link to="/" className="marca">🏪 Mi Kiosco</Link>

                <nav>
                    <NavLink to="/" end>Inicio</NavLink>
                    {usuario && <NavLink to="/productos">Productos</NavLink>}
                    {usuario && <NavLink to="/categorias">Categorías</NavLink>}
                </nav>

                <div className="sesion">
                    {usuario ? (
                        <>
                            <span>{usuario.nombre}</span>
                            <button className="btn-secundario" onClick={salir}>Salir</button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login">Ingresar</NavLink>
                            <NavLink to="/registro">Crear cuenta</NavLink>
                        </>
                    )}
                </div>
            </header>

            <main className="contenido">
                <Outlet />     {/* acá se dibuja la página de la ruta actual */}
            </main>
        </>
    )
}

export default Layout