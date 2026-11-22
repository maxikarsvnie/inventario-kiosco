import { useState } from "react";
import { AuthContext } from "./AuthContext.js";
import * as authService from "../services/auth.js"

//Lee la sesion guardada (si el usuario recarga la pag no se pierde)
function leerUsuarioGuardado(){
    try{
        const guardado = localStorage.getItem("usuario")
        return guardado ? JSON.parse(guardado) : null
    } catch {
        return null
    }
}

export function AuthProvider({children}){
    //con una funcion: React la ejecuta una sola vez al principio
    const [usuario, setUsuario] = useState(leerUsuarioGuardado)

    //Guarda el token
    function abrirSesion({token, usuario}){
        localStorage.setItem("token", token)
        localStorage.setItem("usuario", JSON.stringify(usuario))
        setUsuario(usuario)
    }

    async function login(credenciales) {
        const respuesta = await authService.login(credenciales)
        abrirSesion(respuesta)
    }

    async function registro(datos) {
        const respuesta = await authService.registro(datos)
        abrirSesion(respuesta)
    }

    function cerrarSesion(){
        localStorage.removeItem("token")
        localStorage.removeItem("usuario")
        setUsuario(null)
    }

    return(
        <AuthContext.Provider value={{ usuario, login, registro, cerrarSesion }}>
            {children}
        </AuthContext.Provider>        
    )
}

export default AuthProvider