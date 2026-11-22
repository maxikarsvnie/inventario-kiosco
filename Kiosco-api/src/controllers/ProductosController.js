import * as ProductoModel from "../models/ProductoModel.js"
import * as CategoriaModel from "../models/CategoriaModels.js"

const STOCK_MINIMO = Number(process.env.STOCK_MINIMO) || 5

async function validarProducto(body, usuarioId) {
    const {nombre, precio, stock, categoriaId} = body ?? {}

    //Nombre: tecto, no vacio
    if (typeof nombre !== "string" || !nombre.trim()){
        return {error: "El nombre es obligatorio"}
    }

    //Precio: numero mayor o igual a 0
    const precioNum = Number(precio)
    if (precio === "" || precio === null || precio === undefined || isNaN(precioNum) || precioNum < 0){
        return {error: "El precio debe ser un numero mayor o igual a 0"}
    } 

    //Stock: numero entero mayor o igual a 0
    const stockNum = Number(stock)
    if (!Number.isInteger(stockNum) || stockNum < 0){
        return {error:"El stock debe ser un numero entero mayor o igual a 0"}
    }

    //Categoria: un id valido...
    const categoriaNum = Number(categoriaId)
    if (!Number.isInteger(categoriaNum) || categoriaNum <= 0){
        return {error: "Hay que elegir una categoria"}
    }

    //... que exista y que sea de este usuario
    const categoria = await CategoriaModel.obtenerPorId(categoriaNum, usuarioId)
    if (!categoria){
        return {error: "La categoria elegida no existe"}
    }

    return{
        datos: {
            nombre: nombre.trim(),
            precio: precioNum,
            stock: stockNum,
            categoriaId: categoriaNum
        }
    }
}

export async function listar(req, res, next) {
    try{
        const productos = await ProductoModel.listar(req.usuario.id)
        res.json(productos)
    } catch (error) {
        next(error)
    }
}

export async function listarStockBajo(req, res, next) {
    try{
        const productos = await ProductoModel.listarStockBajo(req.usuario.id,STOCK_MINIMO)
        res.json({minimo:STOCK_MINIMO, productos})
    } catch (error){
        next(error)
    }
}

export async function obtenerPorId(req, res, next) {
    try{
        const id = Number(req.params.id)

        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({ error: "ID invalido"})
        }

        const producto = await ProductoModel.obtenerPorId(id, req.usuario.id)

        if (!producto){
            return res.status(404).json({ error: "Producto no encontrado"})
        }

        res.json(producto)
    } catch (error) {
        next(error)
    }
}

export async function crear(req, res, next) {
    try {
        const { error, datos} = await validarProducto(req.body, req.usuario.id)
        if (error){
            return res.status(400).json({error})
        }

        const producto = await ProductoModel.crear(req.usuario.id, datos)
        res.status(201).json(producto)
    }catch (error){
        next(error)
    }
}

export async function actualizar(req, res, next) {
    try{
        const id = Number(req.params.id)

        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID invalido"})
        }

        const {error, datos} = await validarProducto(req.body, req.usuario.id)
        if(error){
            return res.status(400).json({error})
        }

        const producto = await ProductoModel.actualizar(id, req.usuario.id, datos)
        if(!producto){
            return res.status(404).json({error: "Producto no encotrado"})
        }

        res.json(producto)
    }catch(error){
        next(error)
    }
}

export async function eliminar(req, res, next) {
    try{
        const id = Number(req.params.id)

        if(!Number.isInteger(id) || id <= 0){
            return res.status(400).json({error: "ID invalido"})
        }

        const eliminado = await ProductoModel.eliminar(id, req.usuario.id)

        if(!eliminado){
            return res.status(404).json({ error:"Producto no encontrado"})
        }

        res.status(204).send()
    } catch (error) {
        next(error)
    }
}