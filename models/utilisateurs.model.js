const mongoose = require("mongoose");

const utilisateursSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  motDePasse: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["client", "superAdmin", "adminMarketing", "adminAchat", "internaute"],
    default: "client"
  },

  statut: {
    type: String,
    enum: ["actif", "enCours", "bloque"],
    default: "enCours"
  },

  // ✅ Email verification
  verificationToken: String,
  verificationTokenExpires: Date,

  // ✅ 2FA (Google Authenticator)
  twoFASecret: String,
  twoFAEnabled: {
    type: Boolean,
    default: false
  },

  dateCreation: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Utilisateurs", utilisateursSchema);