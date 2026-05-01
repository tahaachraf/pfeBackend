const mongoose = require("mongoose");

const produitSchema = new mongoose.Schema({

  nom: {
    type: String,
    required: true
  },

  reference: {
    type: String,
    required: true,
    unique: true
  },

  cout: {
    type: Number,
    required: true
  },

  prix: {
    type: Number,
    required: true
  },

  poids: {
    type: Number
  },

  quantiteStock: {
    type: Number,
    default: 0
  },

  delaiLivraison: {
    type: Number
  },

  slug: {
    type: String,
    required: true,
    unique: true
  },

  titreSite: String,

  description: String,

  descriptionSupplementaire: String,

  metaDescription: String,

  motsClesMeta: String,

  promotion: {
    type: Boolean,
    default: false
  },

  statutProduit: {
    type: String,
    enum: ["EnCours", "Active", "NonActive", "Archive"],
    default: "EnCours"
  },

  dateCreation: {
    type: Date,
    default: Date.now
  },

  dateModification: {
    type: Date,
    default: Date.now
  },

  creePar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateurs"
  },

  categorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categorie",
    required: true
  }

});

module.exports = mongoose.model("Produit", produitSchema);