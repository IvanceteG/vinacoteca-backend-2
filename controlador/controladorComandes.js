import Comanda from '../modelos/modeloComanda.js';
import Vino from '../modelos/modeloVinos.js';
import Cerveza from '../modelos/modeloCervezas.js';
import { enviarCorreuComanda } from '../services/mailService.js';

// POST /api/comandes — crear comanda (usuari autenticat)
export const crearComanda = async (req, res) => {
  try {
    const { linies, adreca, notes } = req.body;

    if (!linies || !Array.isArray(linies) || linies.length === 0) {
      return res.status(400).json({ error: 'La comanda ha de tenir almenys una línia' });
    }

    // Validar que cada producte existeix i capturar el preu actual
    const liniesValidades = [];
    for (const linia of linies) {
      const { tipusProducte, producte, quantitat } = linia;

      if (!['Vino', 'Cerveza'].includes(tipusProducte)) {
        return res.status(400).json({ error: `tipusProducte invàlid: ${tipusProducte}` });
      }
      if (!producte) {
        return res.status(400).json({ error: 'Falta l\'id del producte' });
      }
      if (!quantitat || quantitat < 1) {
        return res.status(400).json({ error: 'La quantitat ha de ser almenys 1' });
      }

      const Model = tipusProducte === 'Vino' ? Vino : Cerveza;
      const doc = await Model.findById(producte);
      if (!doc) {
        return res.status(404).json({ error: `Producte no trobat: ${producte}` });
      }

      liniesValidades.push({
        tipusProducte,
        producte: doc._id,
        quantitat,
        preuUnitari: doc.preu ?? 0
      });
    }

    const novaComanda = await Comanda.create({
      usuari: req.usuari._id,
      linies: liniesValidades,
      adreca: adreca ?? '',
      notes: notes ?? ''
    });

    // Populate per retornar la comanda completa amb noms de productes
    const comandaCompleta = await Comanda.findById(novaComanda._id)
      .populate('linies.producte')
      .populate('usuari', 'email rol');

    // Enviar correu al propietari (error controlat: no bloqueja la resposta)
    try {
      await enviarCorreuComanda(req.usuari, comandaCompleta);
    } catch (mailErr) {
      console.error('Error enviant correu:', mailErr.message);
    }

    res.status(201).json(comandaCompleta);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET /api/comandes/me — comandes de l'usuari autenticat
export const getMevesComandes = async (req, res) => {
  try {
    const comandes = await Comanda.find({ usuari: req.usuari._id })
      .populate('linies.producte')
      .sort({ createdAt: -1 });
    res.json({ comandes, total: comandes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/comandes — totes les comandes (només admin)
export const getTotesComandes = async (req, res) => {
  try {
    const comandes = await Comanda.find()
      .populate('usuari', 'email rol')
      .populate('linies.producte')
      .sort({ createdAt: -1 });
    res.json({ comandes, total: comandes.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/comandes/:id/estat — canviar estat (admin)
export const updateEstatComanda = async (req, res) => {
  try {
    const { estat } = req.body;
    const estatsValids = ['pendent', 'confirmada', 'enviada', 'entregada', 'cancel·lada'];
    if (!estatsValids.includes(estat)) {
      return res.status(400).json({ error: `Estat no vàlid. Valors permesos: ${estatsValids.join(', ')}` });
    }
    const comanda = await Comanda.findByIdAndUpdate(
      req.params.id,
      { estat },
      { new: true, runValidators: true }
    ).populate('linies.producte').populate('usuari', 'email rol');

    if (!comanda) return res.status(404).json({ error: 'Comanda no trobada' });
    res.json(comanda);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
