const Produit = require("../models/produit.model");


// CREATE
exports.creerProduit = async (req, res) => {
  try {

    const produit = new Produit(req.body);

    const produitSauvegarde = await produit.save();

    res.status(201).json(produitSauvegarde);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// READ ALL
exports.getProduits = async (req, res) => {
  try {

    const produits = await Produit
      .find()
      .populate("categorie")
      .populate("creePar");

    res.json(produits);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// READ ONE BY ID
exports.getProduitById = async (req, res) => {
  try {

    const produit = await Produit
      .findById(req.params.id)
      .populate("categorie")
      .populate("creePar");

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.json(produit);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// READ ONE BY SLUG
exports.getProduitBySlug = async (req, res) => {
  try {

    const produit = await Produit
      .findOne({ slug: req.params.slug })
      .populate("categorie");

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.json(produit);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE
exports.updateProduit = async (req, res) => {
  try {

    req.body.dateModification = Date.now();

    const produit = await Produit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.json(produit);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE
exports.deleteProduit = async (req, res) => {
  try {

    const produit = await Produit.findByIdAndDelete(req.params.id);

    if (!produit) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }

    res.json({ message: "Produit supprimé avec succès" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};