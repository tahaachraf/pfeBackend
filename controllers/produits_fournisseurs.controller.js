const ProduitsFournisseurs = require("../models/produits_fournisseurs.model");

// 🔥 IMPORTANT : Ces imports permettent d'enregistrer les schémas dans Mongoose
// pour éviter l'erreur "Schema hasn't been registered" lors du .populate()
require("../models/produit.model");
require("../models/fournisseurs.model");

// =========================
// CREATE (Ajouter une relation)
// =========================
exports.create = async (req, res) => {
  try {
    const data = new ProduitsFournisseurs(req.body);
    const saved = await data.save();
    
    // On peut aussi populer le résultat après la sauvegarde si besoin
    const populatedData = await ProduitsFournisseurs.findById(saved._id)
      .populate("produit")
      .populate("fournisseur");

    res.status(201).json(populatedData);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création", error: error.message });
  }
};

// =========================
// GET ALL (Lister toutes les relations)
// =========================
exports.getAll = async (req, res) => {
  try {
    const list = await ProduitsFournisseurs.find()
      .populate("produit")
      .populate("fournisseur");

    res.json(list);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
  }
};

// =========================
// GET BY ID (Chercher par ID)
// =========================
exports.getById = async (req, res) => {
  try {
    const item = await ProduitsFournisseurs.findById(req.params.id)
      .populate("produit")
      .populate("fournisseur");

    if (!item) {
      return res.status(404).json({ message: "Relation produit-fournisseur non trouvée" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "ID invalide ou erreur serveur", error: error.message });
  }
};

// =========================
// UPDATE (Modifier une relation)
// =========================
exports.update = async (req, res) => {
  try {
    const updated = await ProduitsFournisseurs.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // runValidators vérifie les types du schéma
    )
    .populate("produit")
    .populate("fournisseur");

    if (!updated) {
      return res.status(404).json({ message: "Relation non trouvée" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// =========================
// DELETE (Supprimer une relation)
// =========================
exports.delete = async (req, res) => {
  try {
    const deleted = await ProduitsFournisseurs.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Relation non trouvée" });
    }

    res.json({ message: "Relation supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
};