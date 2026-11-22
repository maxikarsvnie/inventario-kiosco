import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth.js"

function Inicio() {
    const { usuario } = useAuth()

    return (
        <section className="tarjeta centrado">
            <h1>{usuario ? `Hola, ${usuario.nombre}` : "Inventario de tu kiosco"}</h1>
            <p>Cargá tus productos por categoría y enterate a tiempo de cuáles se están por agotar.</p>

            {usuario ? (
                <div className="acciones">
                    <Link className="boton" to="/productos">Ver productos</Link>
                    <Link className="boton btn-secundario" to="/categorias">Categorías</Link>
                </div>
            ) : (
                <div className="acciones">
                    <Link className="boton" to="/registro">Crear cuenta</Link>
                    <Link className="boton btn-secundario" to="/login">Ya tengo cuenta</Link>
                </div>
            )}
        </section>
    )
}

export default Inicio