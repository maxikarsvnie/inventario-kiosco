// Muestra un mensaje de carga, de error o informativo con un estilo común
function Mensaje({ tipo = "info", children }) {
    return <p className={`mensaje mensaje-${tipo}`}>{children}</p>
}

export default Mensaje