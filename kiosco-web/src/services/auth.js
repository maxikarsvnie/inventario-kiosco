import { request } from "./api.js";

export function login(credenciales){
    return request("/auth/login", {method: "POST", body: credenciales})
}

export function registro(datos){
    return request("/auth/registro", {method: "POST", body: datos})
}