import { request } from "./api.js";

export function listar(){
    return request("/productos")
}

export function stockBajo(){
    return request("/productos/stock-bajo")
}

export function obtener(id){
    return request(`/productos/${id}`)
}

export function crear(producto){
    return request("/productos", {method: "POST", body: producto})
}

export function actualizar(id, producto){
    return request(`/productos/${id}`, {method: "PUT", body: producto})
}

export function eliminar(id){
    return request(`/productos/${id}`, {method: "DELETE"})
}