import pool from "../config/db.js";

// Busca un usuario por email.
// Devuelve el usuario COMPLETO (incluido password_hash) o null si no existe.
// Lo usa el login, que necesita el hash para comparar la contraseña.
export async function buscarPorEmail(email) {
    const [filas] = await pool.query(
        `SELECT * FROM usuarios WHERE email = ?`,
        [email]
    )
    return filas[0] ?? null
}

//Crear un usuario con la contraseña ya hasheada (el hash se hace en el controlador)
//Devuelve solo el {id, nombre email}: el hash nunca sale de la API.
export async function crear({nombre, email, passwordHash}) {
    const [resultado] = await pool.query(
        "INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)",
        [nombre, email, passwordHash]
    )
    return {id: resultado.insertId, nombre, email}
}