// models/marques.model.js

const mongoose = require("mongoose");

const marqueSchema = new mongoose.Schema({

  nom: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    required: true,
    unique: true
  },

  dateCreation: {
    type: Date,
    default: Date.now
  },

  dateModification: {
    type: Date
  }

}, { versionKey: false });

module.exports = mongoose.model("Marque", marqueSchema);