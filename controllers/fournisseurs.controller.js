// controllers/fournisseurs.controller.js

const Fournisseur = require("../models/fournisseurs.model");


// ==============================
// GET ALL FOURNISSEURS
// ==============================

exports.getAll = async (req, res) => {

  try {

    const fournisseurs = await Fournisseur.find()
      .populate("creePar", "nom prenom email");

    res.status(200).json(fournisseurs);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// ==============================
// GET ONE FOURNISSEUR
// ==============================

exports.getOne = async (req, res) => {

  try {

    const fournisseur = await Fournisseur.findById(req.params.id)
      .populate("creePar", "nom prenom email");

    if (!fournisseur) {
      return res.status(404).json({ message: "Fournisseur non trouvé" });
    }

    res.status(200).json(fournisseur);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// ==============================
// CREATE FOURNISSEUR
// ==============================

exports.create = async (req, res) => {

  try {

    const fournisseur = new Fournisseur(req.body);

    const savedFournisseur = await fournisseur.save();

    res.status(201).json(savedFournisseur);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// ==============================
// UPDATE FOURNISSEUR
// ==============================

exports.update = async (req, res) => {

  try {

    const fournisseur = await Fournisseur.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!fournisseur) {
      return res.status(404).json({ message: "Fournisseur non trouvé" });
    }

    res.status(200).json(fournisseur);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// ==============================
// DELETE FOURNISSEUR
// ==============================

exports.delete = async (req, res) => {

  try {

    const fournisseur = await Fournisseur.findByIdAndDelete(req.params.id);

    if (!fournisseur) {
      return res.status(404).json({ message: "Fournisseur non trouvé" });
    }

    res.status(200).json({ message: "Fournisseur supprimé avec succès" });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};