const mongoose = require("mongoose");

const piecesJointesSchema = new mongoose.Schema({

  nomFichier: {
    type: String,
    required: true
  },

  url: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    required: true,
    unique: true
  },

  type: {
    type: String,
    enum: ["pdf", "image", "doc", "autre"],
    default: "pdf"
  },

  taille: String,

  // 🔥 NOUVEAU CHAMP
  id_produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produits",
    required: true
  }

}, {
  timestamps: true,
  versionKey: false,
  collection: "pieces_jointes"
});

module.exports = mongoose.model("PiecesJointes", piecesJointesSchema);