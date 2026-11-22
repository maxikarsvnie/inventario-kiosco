import jwt from "jsonwebtoken"

export function requiereAutenticacion(req, res, next){
    
    const cabecera = req.headers.authorization ?? ""
    const [tipo, token] = cabecera.split(" ")

    if (tipo !== "Bearer" || !token) {
        return res.status(401).json({error: "Falta el token"})
    }

    try {
        const datos = jwt.verify(token, process.env.JWT_SECRET)

        req.usuario = {id: datos.id, email: datos.email}

        next()
    } catch {
        return res.status(401).json({error: "Token invalido o vencido"})
    }
}