const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Utilisateur = require("../models/utilisateur.model");
const sendVerificationEmail = require("../services/email.service");

// =========================
// LOGIN
// =========================
exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ message: "Login et mot de passe requis" });
    }

    const user = await Utilisateur.findByLogin(login);
    if (!user) {
      return res.status(401).json({ message: "Login incorrect" });
    }

    // ✅ Bloque les comptes en attente d'activation
    if (user.statut === "EnAttente") {
      return res.status(403).json({
        message: "Compte non activé. Vérifiez votre email."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user.id_utilisateur, statut: user.statut, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id_utilisateur,
        username: user.username,
        statut: user.statut
      }
    });

  } catch (error) {
    console.error("Erreur login :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// =========================
// REGISTER
// =========================
exports.register = async (req, res) => {
  try {
    const { login, password, username } = req.body;

    if (!login || !password || !username) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    const existingUser = await Utilisateur.findByLogin(login);
    if (existingUser) {
      return res.status(409).json({ message: "Login déjà utilisé" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    // ✅ Génère un token de vérification email
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = Date.now() + 1000 * 60 * 60; // 1h

    await Utilisateur.create({
      login,
      password_hash,
      username,
      statut: "EnAttente",          // ← en attente jusqu'à validation email
      verificationToken,
      verificationTokenExpires
    });

    // ✅ Envoie l'email de vérification (login = adresse email)
    const link = `http://localhost:3500/api/auth/verify/${verificationToken}`;
    await sendVerificationEmail(login, link);

    res.status(201).json({
      message: "Inscription réussie. Vérifiez votre email pour activer votre compte."
    });

  } catch (error) {
    console.error("Erreur register :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// =========================
// VERIFY EMAIL ← NOUVEAU
// =========================
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await Utilisateur.findByVerificationToken(token);

    if (!user || user.verificationTokenExpires < Date.now()) {
      return res.status(400).send("Lien invalide ou expiré");
    }

    // ✅ Active le compte
    await Utilisateur.activate(user.id_utilisateur);

    // ✅ Génère un JWT pour l'auto-connexion
    const jwtToken = jwt.sign(
      { id: user.id_utilisateur, statut: "Client", username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // ✅ Encode les données dans l'URL → frontend se connecte automatiquement
    const userData = {
      id: user.id_utilisateur,
      username: user.username,
      statut: "Client",
      token: jwtToken
    };
    const encoded = encodeURIComponent(JSON.stringify(userData));

    return res.redirect(`http://localhost:5173/compte-active?u=${encoded}`);

  } catch (error) {
    console.error("Erreur verifyEmail :", error);
    res.status(500).send("Erreur serveur");
  }
};

// =========================
// CREATE ADMIN (TEST) ⚠️ À SUPPRIMER EN PROD
// =========================
exports.createAdmin = async (req, res) => {
  try {
    const { login, password, username } = req.body;

    const hash = await bcrypt.hash(password, 10);

    await Utilisateur.create({
      login,
      password_hash: hash,
      username,
      statut: "Admin"
    });

    res.status(201).json({ message: "Administrateur créé" });

  } catch (error) {
    console.error("Erreur createAdmin :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};