// server.js

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config();

const app = express();

// =========================
// CORS — autorise le frontend sur port 5173
// =========================
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Middleware
app.use(express.json());

// =========================
// Fichiers statiques (images & PDFs)
// =========================
app.use("/api/uploads", express.static(path.join(__dirname, "uploads/images")));
app.use("/api/pieces-jointes-files", express.static(path.join(__dirname, "uploads/pieces_jointes")));

// =========================
// Connexion MongoDB
// =========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté ✅"))
  .catch(err => console.error("Erreur MongoDB ❌", err));

// =========================
// Route de connexion
// =========================
const Utilisateur = require("./models/utilisateurs.model");

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, motDePasse, password, role } = req.body;
    const mdp = motDePasse || password;

    if (!email || !mdp) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const user = await Utilisateur.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email incorrect" });
    }

    const isMatch = await bcrypt.compare(mdp, user.motDePasse);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Si "enCours" ET token expiré → passer à "bloque" automatiquement
    if (user.statut === "enCours" && user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
      user.statut = "bloque";
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;
      await user.save();
      console.log(`🔒 Compte expiré et bloqué : ${user.email}`);
    }

    if (user.statut === "enCours") {
      return res.status(403).json({
        message: "Votre compte est en cours de validation. Vérifiez votre email et cliquez sur le lien de validation.",
        statut: "enCours"
      });
    }

    if (user.statut === "bloque") {
      return res.status(403).json({
        message: "Votre compte a été bloqué car le délai de validation est dépassé. Veuillez vous réinscrire.",
        statut: "bloque"
      });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ message: "Accès refusé : rôle insuffisant" });
    }

    res.json({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      statut: user.statut
    });

  } catch (err) {
    console.error("Erreur login:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// =========================
// Routes
// =========================
const utilisateursRoutes = require("./routes/utilisateurs.routes");
const produitsRoutes = require("./routes/produits.routes");
const categoriesRoutes = require("./routes/categories.route");
const marquesRoutes = require("./routes/marques.route");
const modelsRoutes = require("./routes/models.route");
const fournisseursRoutes = require("./routes/fournisseurs.route");
const commandesRoutes = require("./routes/commandes.route");
const imagesProduitsRoutes = require("./routes/images_produits.route");
const piecesJointesRoutes = require("./routes/pieces_jointes.route");
const produitsFournisseursRoutes = require("./routes/produits_fournisseurs.route");
const paimentRoutes = require("./routes/paiment.route");
const produitsComplementairesRoutes = require("./routes/produits_complementaires.route");
const commandeProduitsRoutes = require("./routes/commande_produits.route");
const produitMarqueRoutes = require("./routes/produit_marque.route");
const produitModeleRoutes = require("./routes/produit_modele.route");

app.use("/api", utilisateursRoutes);
app.use("/api/produits", produitsRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", marquesRoutes);
app.use("/api", modelsRoutes);
app.use("/api", fournisseursRoutes);
app.use("/api", commandesRoutes);
app.use("/api", imagesProduitsRoutes);
app.use("/api", piecesJointesRoutes);
app.use("/api", produitsFournisseursRoutes);
app.use("/api", paimentRoutes);
app.use("/api", produitsComplementairesRoutes);
app.use("/api", commandeProduitsRoutes);
app.use("/api", produitMarqueRoutes);
app.use("/api", produitModeleRoutes);

// =========================
// Route test
// =========================
app.get("/", (req, res) => {
  res.send("API Ecommerce OK ✅");
});

// =========================
// Tâche automatique : expiration des comptes "enCours"
// Toutes les 10 minutes → statut "bloque" si délai dépassé
// =========================
setInterval(async () => {
  try {
    const result = await Utilisateur.updateMany(
      {
        statut: "enCours",
        verificationTokenExpires: { $lt: new Date() }
      },
      {
        $set: { statut: "bloque" },
        $unset: { verificationToken: "", verificationTokenExpires: "" }
      }
    );
    if (result.modifiedCount > 0) {
      console.log(`🔒 ${result.modifiedCount} compte(s) bloqué(s) (délai dépassé)`);
    }
  } catch (err) {
    console.error("Erreur tâche expiration :", err.message);
  }
}, 10 * 60 * 1000); // toutes les 10 minutes

// =========================
// Lancement serveur
// =========================
const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});