import pool from "../config/db.js"

export async function listar(usuarioId) { 
    const [filas] = await pool.query(
        "SELECT * FROM categorias WHERE usuario_id = ? ORDER BY nombre",[usuarioId]
    )
    return filas
}

export async function obtenerPorId(id, usuarioId) {
    const [filas] = await pool.query(
        "SELECT * FROM categorias WHERE id = ? AND usuario_id = ?",
        [id, usuarioId]
    )
    const categoria = filas[0]

    if (!categoria) {
        return null
    }
    return categoria
}

export async function crear(usuarioId, nombre) {
    const [resultado] = await pool.query(
        "INSERT INTO categorias (usuario_id, nombre) VALUES (?, ?)",
        [usuarioId, nombre]
    )
    return obtenerPorId(resultado.insertId, usuarioId)
}

export async function actualizar(id, usuarioId, nombre) {
    const [resultado] = await pool.query(
        "UPDATE categorias SET nombre = ? WHERE id = ? AND usuario_id = ?",
        [nombre, id, usuarioId]
    )

    if (resultado.affectedRows === 0) {
        return null
    }
    return obtenerPorId(id, usuarioId)
}

export async function eliminar(id, usuarioId) {
    const [resultado] = await pool.query(
        "DELETE FROM categorias WHERE id = ? AND usuario_id = ?",
        [id, usuarioId]
    )
    return resultado.affectedRows > 0
}