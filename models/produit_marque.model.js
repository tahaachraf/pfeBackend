const mongoose = require("mongoose");

const produitMarqueSchema = new mongoose.Schema({
  produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produit", // ✅ IMPORTANT (sans "s")
    required: true
  },
  marque: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Marque",
    required: true
  }
}, {
  timestamps: true,
  versionKey: false,
  collection: "produit_marque"
});

module.exports = mongoose.model("ProduitMarque", produitMarqueSchema);