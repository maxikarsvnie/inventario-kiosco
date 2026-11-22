const API_URL = import.meta.env.VITE_API_URL

export async function request(ruta, {method = "GET", body} ={}) {
    const headers = {}

    //Si mandamos datos, avisamos que son JSON
    if (body !== undefined){
        headers["Content-Type"]= "application/json"
    }

    //Si hay sesuin, mandamos el token en cada pedido
    const token = localStorage.getItem("token")
    if (token){
        headers.Authorization = `Bearer ${token}`
    }

    const res = await fetch(`${API_URL}${ruta}`,{
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined
    })

    //204 = sin contrniedo (por ej, despues de un DELETE)
    if (res.status === 204) return null

    //Si la respuesta no es JSON, no explita queda null
    const datos = await res.json().catch(() => null)

    //Si la API respondio un error, lo lanzamos con el msj que mando
    if (!res.ok){
        throw new Error(datos?.error ?? `Error ${res.status}`)
    }

    return datos
}