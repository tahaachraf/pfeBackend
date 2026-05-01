const mongoose = require("mongoose");

const commandeProduitsSchema = new mongoose.Schema({
  id_commande: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Commandes",
    required: true
  },
  id_produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produit", // ✅ sans "s"
    required: true
  },
  quantite: {
    type: Number,
    required: true,
    min: 1
  },
  prixUnitaire: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false,
  collection: "commande_produits"
});

module.exports = mongoose.model("CommandeProduits", commandeProduitsSchema);