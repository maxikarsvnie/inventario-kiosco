import { Router } from "express";
import * as ProductoController from "../controllers/ProductosController.js"
import { requiereAutenticacion } from "../middlewares/autenticacion.js";

const router = Router()

router.use(requiereAutenticacion)

router.get("/", ProductoController.listar)

router.get("/stock-bajo", ProductoController.listarStockBajo)

router.get("/:id", ProductoController.obtenerPorId)

router.post("/", ProductoController.crear)

router.put("/:id", ProductoController.actualizar)

router.delete("/:id", ProductoController.eliminar)

export default router