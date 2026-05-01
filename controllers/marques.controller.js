// controllers/marques.controller.js

const Marque = require("../models/marques.model");

/**
 * =========================
 * GET ALL MARQUES
 * =========================
 */
exports.getAll = async (req, res) => {

  try {

    const marques = await Marque.find();

    res.status(200).json(marques);

  } catch (error) {

    console.error("Erreur getAll :", error);
    res.status(500).json({ message: "Erreur serveur" });

  }

};


/**
 * =========================
 * GET ONE MARQUE
 * =========================
 */
exports.getOne = async (req, res) => {

  try {

    const marque = await Marque.findById(req.params.id);

    if (!marque) {
      return res.status(404).json({ message: "Marque non trouvée" });
    }

    res.status(200).json(marque);

  } catch (error) {

    console.error("Erreur getOne :", error);
    res.status(500).json({ message: "Erreur serveur" });

  }

};


/**
 * =========================
 * CREATE MARQUE
 * =========================
 */
exports.create = async (req, res) => {

  try {

    const { nom, slug } = req.body;

    const exist = await Marque.findOne({ slug });

    if (exist) {
      return res.status(400).json({ message: "Cette marque existe déjà" });
    }

    const marque = new Marque({
      nom,
      slug
    });

    await marque.save();

    res.status(201).json({
      message: "Marque créée avec succès",
      marque
    });

  } catch (error) {

    console.error("Erreur create :", error);
    res.status(500).json({ message: "Erreur serveur" });

  }

};


/**
 * =========================
 * UPDATE MARQUE
 * =========================
 */
exports.update = async (req, res) => {

  try {

    const marque = await Marque.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        dateModification: Date.now()
      },
      { new: true }
    );

    if (!marque) {
      return res.status(404).json({ message: "Marque non trouvée" });
    }

    res.status(200).json({
      message: "Marque modifiée avec succès",
      marque
    });

  } catch (error) {

    console.error("Erreur update :", error);
    res.status(500).json({ message: "Erreur serveur" });

  }

};


/**
 * =========================
 * DELETE MARQUE
 * =========================
 */
exports.delete = async (req, res) => {

  try {

    const marque = await Marque.findByIdAndDelete(req.params.id);

    if (!marque) {
      return res.status(404).json({ message: "Marque non trouvée" });
    }

    res.status(200).json({
      message: "Marque supprimée avec succès"
    });

  } catch (error) {

    console.error("Erreur delete :", error);
    res.status(500).json({ message: "Erreur serveur" });

  }

};