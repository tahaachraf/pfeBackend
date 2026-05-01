const mongoose = require("mongoose");

const produitsFournisseursSchema = new mongoose.Schema({

  produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produit",
    required: true
  },

  fournisseur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fournisseur",
    required: true
  },

  reference_fournisseur: {
    type: String,
    required: true
  },

  prix_achat: {
    type: Number,
    required: true
  }

}, {
  timestamps: true,
  versionKey: false,
  collection: "produits_fournisseurs" // 🔥 IMPORTANT
});

module.exports = mongoose.model("ProduitsFournisseurs", produitsFournisseursSchema);