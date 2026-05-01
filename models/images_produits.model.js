// models/images_produits.model.js

const mongoose = require("mongoose");

const imagesProduitsSchema = new mongoose.Schema({

  id_produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produit",
    required: true
  },

  image: {
    type: String,
    required: true
  },

  slug_image: {
    type: String,
    required: true
  },

  texte_alternatif: {
    type: String
  },

  ordreAffichage: {
    type: Number,
    default: 1
  }

}, { versionKey: false });

module.exports = mongoose.model("ImagesProduits", imagesProduitsSchema);