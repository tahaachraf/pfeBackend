const mongoose = require("mongoose");

const paimentSchema = new mongoose.Schema({
  commandeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Commandes", // Vérifie bien si c'est "Commandes" ou "Commande" dans le modèle commande
    required: true
  },
  montant: {
    type: Number,
    required: true
  },
  methodePaiement: {
    type: String,
    enum: ["carte", "cash", "virement"],
    required: true
  },
  statutPaiement: {
    type: String,
    enum: ["en_attente", "valide", "refuse"],
    default: "en_attente"
  },
  datePaiement: {
    type: Date
  }
}, {
  timestamps: true,
  versionKey: false,
  collection: "paiment"
});

// ======================================================
// Hooks (Middleware) - Version moderne sans 'next'
// ======================================================

// 🔥 Pour le .save() (utilisé dans controller.create)
paimentSchema.pre("save", async function() {
  if (this.statutPaiement === "valide" && !this.datePaiement) {
    this.datePaiement = new Date();
  }
});

// 🔥 Pour le findOneAndUpdate (utilisé dans controller.update)
paimentSchema.pre("findOneAndUpdate", async function() {
  const update = this.getUpdate();

  // On vérifie si le statut change pour "valide"
  if (update.statutPaiement === "valide") {
    update.datePaiement = new Date();
  } 
  // Cas où l'update utilise l'opérateur $set (très courant)
  else if (update.$set && update.$set.statutPaiement === "valide") {
    update.$set.datePaiement = new Date();
  }
});

module.exports = mongoose.model("Paiment", paimentSchema);