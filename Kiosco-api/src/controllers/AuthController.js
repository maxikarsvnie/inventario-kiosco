import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import * as UsuarioModel from "../models/UsuarioModel.js"

//Exetensio regular simplre para validar el formato del mail
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

//Crea el token JWT con el id y el mail del usuario adentro
function generarToken(usuario){
    return jwt.sign(
        {id: usuario.id, email: usuario.email},               //Lo que va dentro de Token
        process.env.JWT_SECRET,                               //La clave con la que se firma
        {expiresIn: process.env.JWT_EXPIRES_IN || "2s"}       //Cuanto dura
    )
}

export async function registro(req, res, next) {
    try{
        const {nombre, email, password} = req.body ?? {}

        //1) Validacion
        if (typeof nombre !== "string" || !nombre.trim()){
            return res.status(400).json({error: "El nombre es obligatorio"})
        }
        if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())){
            return res.status(400).json({error:"El email no es valido"})
        }
        if (typeof password !== "string" || password.length < 8){
            return res.status(400).json({error:"La contraseña debe tener al menos 8 caracteres"})
        }

        //2) Hashear la contraseña (el 10 es el "costo": cuanto trabajo le cuesta a bcrypt)
        const passwordHash = await bcrypt.hash(password, 10)

        //3) Guardar el usuario
        const usuario = await UsuarioModel.crear({
            nombre: nombre.trim(),
            email: email.trim().toLowerCase(), //asi "Ana@Mail.com" y "ana@mail.com" son el mismo
            passwordHash
        })

        //4) Registrarse tambien deja la sesion iniciada: devolvemos token + usuario
        res.status(201).json({token: generarToken(usuario), usuario})
    } catch (error) {
        //El mail ya existe (por el UNIQUE de la tabla usuarios)
        if (error.code === "ER_DUP_ENTRY"){
            return res.status(409).json({error: "Ese email ya esta registrado"})
        }
        next(error)
    }
}

export async function login(req, res, next) {
    try {
        const { email,password} = req.body ?? {}

        if (typeof email !== "string" || typeof password !== "string" || !email || !password){
            return res.status(400).json({error:"Email y constraña son obligarotios"})
        }

        //1) Busca el usuario 
        const usuario = await UsuarioModel.buscarPorEmail(email.trim().toLowerCase())

        //2) Compara la contraseña con el hash guardado
        // (si el usuario no existe, ni siquiera comparamos)
        const coincide = usuario && await bcrypt.compare(password, usuario.password_hash)

        //3)Mismo 401 si no existe el email o si la contraseña esta mal
        if (!coincide){
            return res.status(401).json({error: "Email o contraseña incorrectos"})
        }

        //4) Todo bien; armamos el usuaario SIN el hash y devolvemos el token
        const datosUsuario = { id: usuario.id, nombre: usuario.nombre, email:usuario.email}
        res.json({token: generarToken(datosUsuario), usuario: datosUsuario})
    } catch (error){
        next(error)
    }
}