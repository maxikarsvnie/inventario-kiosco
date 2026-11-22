import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout.jsx"
import RutaProtegida from "./components/RutaProtegida.jsx"
import Inicio from "./pages/Inicio.jsx"
import Login from "./pages/Login.jsx"
import Registro from "./pages/Registro.jsx"
import Productos from "./pages/Productos.jsx"
import NuevoProducto from "./pages/NuevoProducto.jsx"
import DetalleProducto from "./pages/DetalleProducto.jsx"
import Categorias from "./pages/Categorias.jsx"
import NoEncontrada from "./pages/NoEncontrada.jsx"

function App() {
    return (
        <Routes>
            {/* Ruta de diseño: el Layout (barra de menú) envuelve a todas */}
            <Route element={<Layout />}>
                <Route path="/" element={<Inicio />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />

                {/* Todas estas exigen sesión */}
                <Route element={<RutaProtegida />}>
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/productos/nuevo" element={<NuevoProducto />} />
                    <Route path="/productos/:id" element={<DetalleProducto />} />
                    <Route path="/categorias" element={<Categorias />} />
                </Route>

                <Route path="*" element={<NoEncontrada />} />
            </Route>
        </Routes>
    )
}

export default App