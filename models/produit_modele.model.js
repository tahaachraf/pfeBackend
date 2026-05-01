const mongoose = require("mongoose");

const produitModeleSchema = new mongoose.Schema({
  produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produit", // ✅ IMPORTANT sans "s"
    required: true
  },
  modele: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Model", // ✅ correspond à ton model models.model.js
    required: true
  }
}, {
  timestamps: true,
  versionKey: false,
  collection: "produit_modele"
});

module.exports = mongoose.model("ProduitModele", produitModeleSchema);