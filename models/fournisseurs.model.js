// models/fournisseurs.model.js

const mongoose = require("mongoose");

const fournisseurSchema = new mongoose.Schema({

  nom: {
    type: String,
    required: true,
    trim: true
  },

  tel: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    lowercase: true
  },

  siteWeb: {
    type: String
  },

  creePar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateurs",
    required: true
  },

  dateCreation: {
    type: Date,
    default: Date.now
  }

}, { versionKey: false });

module.exports = mongoose.model("Fournisseur", fournisseurSchema);