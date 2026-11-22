import { request } from "./api.js";

export function listar(){
    return request("/categorias")
}

export function crear(categoria){
    return request("/categorias", {method: "POST", body: categoria})
}

export function actualizar(id, categoria){
    return request(`/categorias/${id}`, {method: "PUT", body: categoria})
}

export function eliminar(id){
    return request(`/categorias/${id}`, { method: "DELETE"})
}