import { Router } from "express";
import * as CategoriaController from "../controllers/CategoriaController.js"
import { requiereAutenticacion } from "../middlewares/autenticacion.js";

const router = Router()

router.use(requiereAutenticacion)

router.get("/", CategoriaController.listar)

router.get("/:id", CategoriaController.obtenerPorId)

router.post("/", CategoriaController.crear)

router.put("/:id", CategoriaController.actualizar)

router.delete("/:id", CategoriaController.eliminar)

export default router