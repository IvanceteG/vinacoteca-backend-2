import express from "express"
import { getVinos, getVinoById, crearVino, updateVino, deleteVino } from "../controlador/controladorVinos.js"
import { protegir, autoritzar } from "../middlewares/authMiddleware.js"

const router = express.Router()

// Rutes públiques de lectura (sense token)
router.get("/", getVinos)
router.get("/:id", getVinoById)

// Rutes d'escriptura: només rol 'editor' o 'admin'
router.post("/", protegir, autoritzar('editor', 'admin'), crearVino)
router.put("/:id", protegir, autoritzar('editor', 'admin'), updateVino)
router.delete("/:id", protegir, autoritzar('editor', 'admin'), deleteVino)

export default router
