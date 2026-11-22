import pool from "./config/db.js"

async function probarConexion() {
    
    try{
        const [resultado] = await pool.query(
            "SELECT DATABASE() AS base"
        )

        console.log("Conexion exitosa!")
        console.log("Base de datos: ", resultado[0].base)

    } catch (error) {
        console.error("Error de conexion: ", error.message)
    
    } finally {
        await pool.end()
    }
    
}

probarConexion()