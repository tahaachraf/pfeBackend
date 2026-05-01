const ProduitMarque = require("../models/produit_marque.model");

// Pour populate
require("../models/produit.model");
require("../models/marques.model");

// =========================
// CREATE
// =========================
exports.create = async (req, res) => {
  try {
    const data = new ProduitMarque(req.body);
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
    const list = await ProduitMarque.find()
      .populate("produit")
      .populate("marque");

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
    const item = await ProduitMarque.findById(req.params.id)
      .populate("produit")
      .populate("marque");

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
    const updated = await ProduitMarque.findByIdAndUpdate(
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
    const deleted = await ProduitMarque.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Relation non trouvée" });
    }

    res.json({ message: "Relation supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};