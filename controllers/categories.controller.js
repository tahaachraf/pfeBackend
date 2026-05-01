// controllers/categories.controller.js
const Categorie = require("../models/categories.model");

/**
 * =========================
 * GET ALL CATEGORIES
 * =========================
 */
exports.getAll = async (req, res) => {
  try {

    const categories = await Categorie.find()
      .populate("categorieParent", "nom");

    res.status(200).json(categories);

  } catch (error) {
    console.error("Erreur getAll :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


/**
 * =========================
 * GET ONE CATEGORY
 * =========================
 */
exports.getOne = async (req, res) => {
  try {

    const categorie = await Categorie.findById(req.params.id)
      .populate("categorieParent", "nom");

    if (!categorie) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    res.status(200).json(categorie);

  } catch (error) {
    console.error("Erreur getOne :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


/**
 * =========================
 * CREATE CATEGORY
 * =========================
 */
exports.create = async (req, res) => {

  try {

    const {
      nom,
      description,
      slug,
      metaDescription,
      metaKeywords,
      categorieParent
    } = req.body;

    const categorie = new Categorie({
      nom,
      description,
      slug,
      metaDescription,
      metaKeywords,
      categorieParent
    });

    await categorie.save();

    res.status(201).json({
      message: "Catégorie créée avec succès",
      categorie
    });

  } catch (error) {
    console.error("Erreur create :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }

};


/**
 * =========================
 * UPDATE CATEGORY
 * =========================
 */
exports.update = async (req, res) => {

  try {

    const categorie = await Categorie.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        dateModification: Date.now()
      },
      { new: true }
    );

    if (!categorie) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    res.status(200).json({
      message: "Catégorie modifiée avec succès",
      categorie
    });

  } catch (error) {
    console.error("Erreur update :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }

};


/**
 * =========================
 * DELETE CATEGORY
 * =========================
 */
exports.delete = async (req, res) => {

  try {

    const categorie = await Categorie.findByIdAndDelete(req.params.id);

    if (!categorie) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    res.status(200).json({
      message: "Catégorie supprimée avec succès"
    });

  } catch (error) {
    console.error("Erreur delete :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }

};