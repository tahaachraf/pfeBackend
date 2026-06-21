// controllers/models.controller.js

const Model = require("../models/models.model");

/**
 * =========================
 * GET ALL MODELS
 * =========================
 */
exports.getAll = async (req, res) => {

  try {

    const models = await Model.find()
      .populate("marque", "nom slug");

    res.status(200).json(models);

  } catch (error) {

    console.error("Erreur getAll :", error);
    res.status(500).json({ message: "Erreur serveur" });

  }

};


/**
 * =========================
 * GET ONE MODEL
 * =========================
 */
exports.getOne = async (req, res) => {

  try {

    const model = await Model.findById(req.params.id)
      .populate("marque", "nom slug");

    if (!model) {
      return res.status(404).json({ message: "Model non trouvé" });
    }

    res.status(200).json(model);

  } catch (error) {

    console.error("Erreur getOne :", error);
    res.status(500).json({ message: "Erreur serveur" });

  }

};


/**
 * =========================
 * CREATE MODEL
 * =========================
 */
exports.create = async (req, res) => {

  try {

    const { nom, marque, idMarque, slug } = req.body;
    const idMarqueFinal = marque || idMarque;

    if (!idMarqueFinal) {
      return res.status(400).json({ message: "La marque est obligatoire" });
    }

    const exist = await Model.findOne({ slug });
    if (exist) {
      return res.status(400).json({ message: "Ce model existe déjà" });
    }

    const model = new Model({
      nom,
      marque: idMarqueFinal,
      slug
    });

    await model.save();

    res.status(201).json({
      message: "Model créé avec succès",
      model
    });

  } catch (error) {

    console.error("Erreur create :", error);
    res.status(500).json({ message: "Erreur serveur" });

  }

};


/**
 * =========================
 * UPDATE MODEL
 * =========================
 */
exports.update = async (req, res) => {

  try {

    const model = await Model.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        dateModification: Date.now()
      },
      { new: true }
    );

    if (!model) {
      return res.status(404).json({ message: "Model non trouvé" });
    }

    res.status(200).json({
      message: "Model modifié avec succès",
      model
    });

  } catch (error) {

    console.error("Erreur update :", error);
    res.status(500).json({ message: "Erreur serveur" });

  }

};


/**
 * =========================
 * DELETE MODEL
 * =========================
 */
exports.delete = async (req, res) => {

  try {

    const model = await Model.findByIdAndDelete(req.params.id);

    if (!model) {
      return res.status(404).json({ message: "Model non trouvé" });
    }

    res.status(200).json({
      message: "Model supprimé avec succès"
    });

  } catch (error) {

    console.error("Erreur delete :", error);
    res.status(500).json({ message: "Erreur serveur" });

  }

};