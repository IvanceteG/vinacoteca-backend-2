import Cerveza from "../modelos/modeloCervezas.js"

const getCervezas = async (req, res) => {
  try {
    const dades = await Cerveza.find().sort({ createdAt: -1 })
    res.json({ dades, total: dades.length })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};

const getCervezaById = async (req, res) => {
  try {
    const dada = await Cerveza.findById(req.params.id)
    if (!dada) {
      return res.status(404).json({ error: 'Cervesa no trobada', id: req.params.id })
    }
    res.json(dada)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
};

const crearCerveza = async (req, res) => {
    try {
        const nova = await Cerveza.create(req.body)
        res.status(201).json(nova)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const updateCerveza = async (req, res) => {
  try {
    const actualitzar = await Cerveza.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!actualitzar) {
      return res.status(404).json({ error: 'Cervesa no trobada', id: req.params.id })
    }
    res.json(actualitzar)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleteCerveza = async (req, res) => {
  try {
    const eliminar = await Cerveza.findByIdAndDelete(req.params.id);
    if (!eliminar) {
      return res.status(404).json({ error: 'Cervesa no trobada', id: req.params.id })
    }
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export { getCervezas, getCervezaById, crearCerveza, updateCerveza, deleteCerveza }
