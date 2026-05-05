import Vino from "../modelos/modeloVinos.js"

const getVinos = async (req, res) => {
  try {
    const dades = await Vino.find().sort({ createdAt: -1 })
    res.json({ dades, total: dades.length })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};

const getVinoById = async (req, res) => {
  try {
    const dada = await Vino.findById(req.params.id)
    if (!dada) {
      return res.status(404).json({ error: 'Vino no trobat', id: req.params.id })
    }
    res.json(dada)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};

const crearVino = async (req, res) => {
    try {
        const nova = await Vino.create(req.body)
        res.status(201).json(nova)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const updateVino = async (req, res) => {
  try {
    const actualitzar = await Vino.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualitzar) {
      return res.status(404).json({ error: 'Vino no trobat', id: req.params.id })
    }
    res.json(actualitzar)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleteVino = async (req, res) => {
  try {
    const eliminar = await Vino.findByIdAndDelete(req.params.id);
    if (!eliminar) {
      return res.status(404).json({ error: 'Vino no trobat', id: req.params.id })
    }
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export { getVinos, getVinoById, crearVino, updateVino, deleteVino }
