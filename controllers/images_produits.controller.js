// controllers/images_produits.controller.js

const ImageProduit = require("../models/images_produits.model");


// ==============================
// GET ALL IMAGES
// ==============================

exports.getAll = async (req, res) => {

  try {

    const images = await ImageProduit.find()
      .populate("id_produit", "nom reference prix");

    res.status(200).json(images);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// ==============================
// GET ONE IMAGE
// ==============================

exports.getOne = async (req, res) => {

  try {

    const image = await ImageProduit.findById(req.params.id)
      .populate("id_produit", "nom reference prix");

    if (!image) {
      return res.status(404).json({ message: "Image non trouvée" });
    }

    res.status(200).json(image);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// ==============================
// CREATE IMAGE
// ==============================

exports.create = async (req, res) => {

  try {

    const image = new ImageProduit(req.body);

    const savedImage = await image.save();

    res.status(201).json(savedImage);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// ==============================
// UPDATE IMAGE
// ==============================

exports.update = async (req, res) => {

  try {

    const image = await ImageProduit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!image) {
      return res.status(404).json({ message: "Image non trouvée" });
    }

    res.status(200).json(image);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};


// ==============================
// DELETE IMAGE
// ==============================

exports.delete = async (req, res) => {

  try {

    const image = await ImageProduit.findByIdAndDelete(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Image non trouvée" });
    }

    res.status(200).json({
      message: "Image supprimée avec succès"
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};