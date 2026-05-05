import express from 'express';
import { protegir, autoritzar } from '../middlewares/authMiddleware.js';
import {
  crearComanda,
  getMevesComandes,
  getTotesComandes,
  updateEstatComanda
} from '../controlador/controladorComandes.js';

const router = express.Router();

// Totes les rutes requereixen autenticació
router.use(protegir);

router.post('/', crearComanda);                                      // usuari autenticat
router.get('/me', getMevesComandes);                                 // usuari autenticat
router.get('/', autoritzar('admin'), getTotesComandes);              // només admin
router.patch('/:id/estat', autoritzar('admin'), updateEstatComanda); // només admin

export default router;
