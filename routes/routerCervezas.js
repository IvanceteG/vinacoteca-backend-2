import express from 'express';
import { protegir, autoritzar } from '../middlewares/authMiddleware.js';
import {
  getCervezas,
  getCervezaById,
  crearCerveza,
  updateCerveza,
  deleteCerveza
} from '../controlador/controladorCervezas.js';

const router = express.Router();

// Rutes públiques de lectura (sense token)
router.get('/', getCervezas);
router.get('/:id', getCervezaById);

// Rutes d'escriptura: només rol 'editor' o 'admin'
router.post('/', protegir, autoritzar('editor', 'admin'), crearCerveza);
router.put('/:id', protegir, autoritzar('editor', 'admin'), updateCerveza);
router.delete('/:id', protegir, autoritzar('editor', 'admin'), deleteCerveza);

export default router;