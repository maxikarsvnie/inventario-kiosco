// Validaciones del lado del cliente.
// Son una comodidad para el usuario: la que protege los datos es la de la API.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Devuelve un objeto con un mensaje por cada campo inválido.
// Si está todo bien, devuelve {} (objeto vacío).
export function validarProducto(datos) {
    const errores = {}

    if (!datos.nombre.trim()) {
        errores.nombre = "El nombre es obligatorio"
    }

    if (datos.precio === "" || Number(datos.precio) < 0) {
        errores.precio = "Ingresá un precio mayor o igual a 0"
    }

    if (datos.stock === "" || !Number.isInteger(Number(datos.stock)) || Number(datos.stock) < 0) {
        errores.stock = "Ingresá un número entero mayor o igual a 0"
    }

    if (!datos.categoriaId) {
        errores.categoriaId = "Elegí una categoría"
    }

    return errores
}

export function validarCredenciales(datos, esRegistro) {
    const errores = {}

    if (esRegistro && !datos.nombre.trim()) {
        errores.nombre = "El nombre es obligatorio"
    }
    if (!EMAIL_REGEX.test(datos.email.trim())) {
        errores.email = "Ingresá un email válido"
    }
    if (datos.password.length < 6) {
        errores.password = "Mínimo 6 caracteres"
    }

    return errores
}