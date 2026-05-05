import express from 'express';
import Usuario from '../modelos/modeloUsuario.js';
import { protegir, autoritzar } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Totes les rutes d'aquest router requereixen ser admin
router.use(protegir, autoritzar('admin'));

// GET /api/usuaris — llistar tots els usuaris
router.get('/', async (req, res) => {
  try {
    const usuaris = await Usuario.find().sort({ createdAt: -1 });
    res.json({ usuaris, total: usuaris.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/usuaris/:id/rol — canviar rol d'un usuari
router.patch('/:id/rol', async (req, res) => {
  try {
    const { rol } = req.body;
    const rols = ['usuari', 'editor', 'admin'];
    if (!rols.includes(rol)) {
      return res.status(400).json({ error: `Rol no vàlid. Valors permesos: ${rols.join(', ')}` });
    }
    const usuari = await Usuario.findByIdAndUpdate(
      req.params.id,
      { rol },
      { new: true, runValidators: true }
    );
    if (!usuari) return res.status(404).json({ error: 'Usuari no trobat' });
    res.json({ usuari: { id: usuari._id, email: usuari.email, rol: usuari.rol } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/usuaris/:id — eliminar usuari (opcional, útil per l'admin)
router.delete('/:id', async (req, res) => {
  try {
    const usuari = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuari) return res.status(404).json({ error: 'Usuari no trobat' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
