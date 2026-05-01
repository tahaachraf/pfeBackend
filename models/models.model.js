const mongoose = require("mongoose");

const modelSchema = new mongoose.Schema({

  nom: {
    type: String,
    required: true
  },

  marque: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Marque",
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

module.exports = mongoose.model("Model", modelSchema, "modeles");