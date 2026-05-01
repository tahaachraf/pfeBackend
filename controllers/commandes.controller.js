// controllers/commandes.controller.js

const Commande = require("../models/commandes.model");


// ==============================
// GET ALL COMMANDES
// ==============================

exports.getAll = async (req, res) => {

  try {

    const commandes = await Commande.find()
      .populate("clientId", "nom prenom email");

    res.status(200).json(commandes);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// ==============================
// GET ONE COMMANDE
// ==============================

exports.getOne = async (req, res) => {

  try {

    const commande = await Commande.findById(req.params.id)
      .populate("clientId", "nom prenom email");

    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    res.status(200).json(commande);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// ==============================
// CREATE COMMANDE
// ==============================

exports.create = async (req, res) => {

  try {

    const commande = new Commande(req.body);

    const savedCommande = await commande.save();

    res.status(201).json(savedCommande);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// ==============================
// UPDATE COMMANDE
// ==============================

exports.update = async (req, res) => {

  try {

    const commande = await Commande.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    res.status(200).json(commande);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// ==============================
// DELETE COMMANDE
// ==============================

exports.delete = async (req, res) => {

  try {

    const commande = await Commande.findByIdAndDelete(req.params.id);

    if (!commande) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    res.status(200).json({
      message: "Commande supprimée avec succès"
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};