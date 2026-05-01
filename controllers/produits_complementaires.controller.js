const ProduitsComplementaires = require("../models/produits_complementaires.model");

// Important pour populate
require("../models/produit.model");

// =========================
// CREATE
// =========================
exports.create = async (req, res) => {
  try {
    const data = new ProduitsComplementaires(req.body);
    const saved = await data.save();
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
    const list = await ProduitsComplementaires.find()
      .populate("produitId")
      .populate("produitComplementaireId");

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// GET BY ID
// =========================
exports.getById = async (req, res) => {
  try {
    const item = await ProduitsComplementaires.findById(req.params.id)
      .populate("produitId")
      .populate("produitComplementaireId");

    if (!item) {
      return res.status(404).json({ message: "Relation non trouvée" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// UPDATE
// =========================
exports.update = async (req, res) => {
  try {
    const updated = await ProduitsComplementaires.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Relation non trouvée" });
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
    const deleted = await ProduitsComplementaires.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Relation non trouvée" });
    }

    res.json({ message: "Relation supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};