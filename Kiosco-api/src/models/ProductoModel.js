import pool from "../config/db.js"

const SELECT_PRODUCTO = `
    SELECT p.*, c.nombre AS categoria
    FROM productos p
    JOIN categorias c ON c.id = p.categoria_id
`
export async function listar(usuarioId) {
    const [filas] = await pool.query(
        `${SELECT_PRODUCTO} WHERE p.usuario_id = ? ORDER BY p.nombre`,
        [usuarioId]
    )
    return filas
}

export async function  listarStockBajo(usuarioId, minimo) {
    const [filas] = await pool.query(
        `${SELECT_PRODUCTO} WHERE p.usuario_id = ? AND p.stock < ? ORDER BY p.nombre`,
        [usuarioId, minimo]
    )  
    return filas  
}

export async function obtenerPorId(id, usuarioId) {
    const [filas] = await pool.query(
        `${SELECT_PRODUCTO} WHERE p.id = ? AND p.usuario_id = ?`,
        [id, usuarioId]
    )
    return filas[0] ?? null
}

export async function crear(usuarioId, datos) {
    const { nombre, precio, stock, categoriaId } = datos

    const [resultado] = await pool.query(
        "INSERT INTO productos (usuario_id, categoria_id, nombre, precio, stock) VALUES (?, ?, ?, ?, ?)",
        [usuarioId, categoriaId, nombre, precio, stock]
    )
    return obtenerPorId(resultado.insertId ,usuarioId)
}

export async function actualizar(id, usuarioId, datos) {
    const { nombre, precio, stock, categoriaId} = datos

    const [resultado] = await pool.query(
    "UPDATE productos SET categoria_id = ?, nombre = ?, precio = ?, stock = ? WHERE id = ? AND usuario_id = ?",        [categoriaId, nombre, precio, stock, id, usuarioId]
    )

    if (resultado.affectedRows === 0) {
        return null
    }
    return obtenerPorId(id, usuarioId)
}

export async function eliminar(id, usuarioId) {
    const [resultado] = await pool.query(
        "DELETE FROM productos WHERE id = ? AND usuario_id = ?",
        [id, usuarioId]
    )
    return resultado.affectedRows > 0
}