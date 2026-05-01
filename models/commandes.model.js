// models/commandes.model.js

const mongoose = require("mongoose");

const commandesSchema = new mongoose.Schema({

  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateurs",
    required: true
  },

  statut: {
    type: String,
    enum: [
      "En attente",
      "Confirmée",
      "Expédiée",
      "Livrée",
      "Annulée"
    ],
    default: "En attente"
  },

  total: {
    type: Number,
    required: true
  },

  dateCommande: {
    type: Date,
    default: Date.now
  }

}, { versionKey: false });

module.exports = mongoose.model("Commandes", commandesSchema);