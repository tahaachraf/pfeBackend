// models/categories.model.js
const mongoose = require("mongoose");

const categorieSchema = new mongoose.Schema({

  nom: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  slug: {
    type: String,
    required: true,
    unique: true
  },

  metaDescription: {
    type: String
  },

  metaKeywords: {
    type: String
  },

  categorieParent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categorie",
    default: null
  },

  dateCreation: {
    type: Date,
    default: Date.now
  },

  dateModification: {
    type: Date
  }

}, { versionKey: false });

module.exports = mongoose.model("Categorie", categorieSchema);