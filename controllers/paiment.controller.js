const Paiment = require("../models/paiment.model");

// Important pour éviter erreurs de populate
require("../models/commandes.model");


// =========================
// CREATE
// =========================
exports.create = async (req, res) => {
  try {
    const paiment = new Paiment(req.body);
    const saved = await paiment.save();

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// =========================
// GET ALL
// =========================
exports.getAll = async (req, res) => {
  try {
    const paiments = await Paiment.find().populate("commandeId");
    res.json(paiments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =========================
// GET BY ID
// =========================
exports.getById = async (req, res) => {
  try {
    const paiment = await Paiment.findById(req.params.id).populate("commandeId");

    if (!paiment) {
      return res.status(404).json({ message: "Paiement non trouvé" });
    }

    res.json(paiment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =========================
// UPDATE
// =========================
exports.update = async (req, res) => {
  try {
    const updated = await Paiment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Paiement non trouvé" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// =========================
// DELETE
// =========================
exports.delete = async (req, res) => {
  try {
    const deleted = await Paiment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Paiement non trouvé" });
    }

    res.json({ message: "Paiement supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};