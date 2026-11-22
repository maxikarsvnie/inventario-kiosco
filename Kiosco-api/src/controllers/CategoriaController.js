import * as CategoriaModel from "../models/CategoriaModels.js"

export async function listar(req, res, next) {
    try {
        const categorias = await CategoriaModel.listar(req.usuario.id)

        res.json(categorias)
    } catch (error) {
        next(error)
    }
}

export async function obtenerPorId(req, res, next) {
    try {
        const id = Number(req.params.id)

        // 1) VALIDAR: ¿es un número entero positivo?
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID inválido" })
        }

        // 2) LLAMAR AL MODELO
        const categoria = await CategoriaModel.obtenerPorId(id, req.usuario.id)

        // 3) ELEGIR LA RESPUESTA
        if (!categoria) {
            return res.status(404).json({ 
                error: "Categoría no encontrada" })
        }

        res.json(categoria)
    } catch (error) {
        next(error)
    }
}

export async function crear(req, res, next) {
    try {
        const { nombre } = req.body ?? {}

        if (typeof nombre !== "string" || !nombre.trim()) {
            return res.status(400).json({
                error: 'El nombre es obligatorio'
            })
        }

        const categoria = await CategoriaModel.crear(req.usuario.id, nombre.trim())

        res.status(201).json(categoria)
    } catch (error) {
        next(error)
    }
}

export async function actualizar(req, res, next) {
    try {
        const id = Number(req.params.id)
        const {nombre} = req.body ?? {}

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ error: "ID invalido"})
        }

        if (typeof nombre !== "string" || !nombre.trim()) {
            return res.status(400).json({ error: "El nombre es obligatorio"})
        }

        const categoria = await CategoriaModel.actualizar(id, req.usuario.id, nombre.trim())

        if(!categoria){
            return res.status(404).json({ error: "Categoria no encontrada"})
        }

        res.json(categoria)
    } catch (error){
        next(error)
    }
}

export async function eliminar(req, res, next) {
    try{
        const id = Number(req.params.id)

        if (!Number.isInteger(id) || id <= 0){
            return res.status(400).json({ error: "ID invalido"})
        }

        const eliminada = await CategoriaModel.eliminar(id, req.usuario.id)
        
        if (!eliminada){
            return res.status(404).json({ error:"Categoria no encontrada"})
        }

        res.status(204).send()
    } catch (error){
        if(error.code === "ER_ROW_IS_REFERENCED_2"){
            return res.status(409).json({
                error: "No se puede eliminar: la categoria tiene productos. Cambiales la categoria primero"
            })
        }
        next(error)
    }
}