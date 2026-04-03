import Viaje from "../models/Viaje.js";

// Filtros disponibles en GET /api/viajes: ejemplo
// ?continente=EUROPA
// ?maxPrecio=2000
// ?proveedor=Kannak
// ?tipologia=plaza_a_plaza_en_grupo

// GET /api/viajes?continente=EUROPA&maxPrecio=2000&proveedor=Kannak
export const getViajes = async (req, res) => {
  try {
    const { continente, maxPrecio, proveedor, tipologia } = req.query;
    const filter = { activo: true };

    if (continente) filter.continente = continente.toUpperCase();
    if (proveedor) filter.proveedor = new RegExp(proveedor, "i");
    if (tipologia) filter.tipologia = tipologia;
    if (maxPrecio) filter.precioHabDoble = { $lte: Number(maxPrecio) };

    const viajes = await Viaje.find(filter).sort({
      continente: 1,
      precioHabDoble: 1,
    });
    res.json({ total: viajes.length, data: viajes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/viajes/:id
export const getViajeById = async (req, res) => {
  try {
    const viaje = await Viaje.findById(req.params.id);
    if (!viaje) return res.status(404).json({ error: "Viaje no encontrado" });
    res.json(viaje);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/viajes
export const createViaje = async (req, res) => {
  try {
    const viaje = await Viaje.create(req.body);
    res.status(201).json(viaje);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/viajes/:id
export const updateViaje = async (req, res) => {
  try {
    const viaje = await Viaje.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!viaje) return res.status(404).json({ error: "Viaje no encontrado" });
    res.json(viaje);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/viajes/:id  (soft delete)
export const deleteViaje = async (req, res) => {
  try {
    const viaje = await Viaje.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true },
    );
    if (!viaje) return res.status(404).json({ error: "Viaje no encontrado" });
    res.json({ message: "Viaje desactivado", data: viaje });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
