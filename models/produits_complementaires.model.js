const mongoose = require("mongoose");

const produitsComplementairesSchema = new mongoose.Schema({
  produitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produit",
    required: true
  },
  produitComplementaireId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produit",
    required: true
  }
}, {
  timestamps: true,
  versionKey: false,
  collection: "produits_complementaires"
});

module.exports = mongoose.model("ProduitsComplementaires", produitsComplementairesSchema);