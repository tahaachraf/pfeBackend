// server.js

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const Stripe = require("stripe");

require("dotenv").config();

const app = express();

// =========================
// Initialisation Stripe
// =========================
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// =========================
// CORS
// =========================
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// =========================
// Middleware
// =========================
app.use(express.json());

// =========================
// Fichiers statiques
// =========================
app.use(
  "/api/uploads",
  express.static(path.join(__dirname, "uploads/images"))
);

app.use(
  "/api/pieces-jointes-files",
  express.static(path.join(__dirname, "uploads/pieces_jointes"))
);

// =========================
// Connexion MongoDB
// =========================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connecté ✅"))
  .catch((err) => console.error("Erreur MongoDB ❌", err));

// =========================
// Route de connexion
// =========================
const Utilisateur = require("./models/utilisateurs.model");

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, motDePasse, password, role } = req.body;

    const mdp = motDePasse || password;

    if (!email || !mdp) {
      return res.status(400).json({
        message: "Email et mot de passe requis",
      });
    }

    const user = await Utilisateur.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Email incorrect",
      });
    }

    const isMatch = await bcrypt.compare(mdp, user.motDePasse);

    if (!isMatch) {
      return res.status(401).json({
        message: "Mot de passe incorrect",
      });
    }

    if (
      user.statut === "enCours" &&
      user.verificationTokenExpires &&
      user.verificationTokenExpires < new Date()
    ) {
      user.statut = "bloque";
      user.verificationToken = undefined;
      user.verificationTokenExpires = undefined;

      await user.save();

      console.log(`🔒 Compte expiré : ${user.email}`);
    }

    if (user.statut === "enCours") {
      return res.status(403).json({
        message: "Votre compte est en cours de validation.",
        statut: "enCours",
      });
    }

    if (user.statut === "bloque") {
      return res.status(403).json({
        message: "Votre compte est bloqué.",
        statut: "bloque",
      });
    }

    if (role && user.role !== role) {
      return res.status(403).json({
        message: "Accès refusé",
      });
    }

    res.json({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
      statut: user.statut,
    });

  } catch (err) {
    console.error("Erreur login:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// =========================
// STRIPE — Checkout Session
// =========================
app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { commandeId, amount, successUrl, cancelUrl } = req.body;

    if (!amount || !successUrl || !cancelUrl) {
      return res.status(400).json({ message: "Paramètres manquants" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: amount,
            product_data: {
              name: "Commande ShopTunisie",
              description: commandeId ? `Commande #${commandeId}` : undefined,
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        commandeId: commandeId || "",
      },
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error("Erreur Stripe :", error);
    res.status(500).json({ error: error.message });
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
// Tâche automatique
// =========================
setInterval(async () => {
  try {
    const result = await Utilisateur.updateMany(
      {
        statut: "enCours",
        verificationTokenExpires: { $lt: new Date() },
      },
      {
        $set: { statut: "bloque" },
        $unset: {
          verificationToken: "",
          verificationTokenExpires: "",
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`🔒 ${result.modifiedCount} compte(s) bloqué(s)`);
    }

  } catch (err) {
    console.error("Erreur tâche expiration :", err.message);
  }
}, 10 * 60 * 1000);

// =========================
// Lancement serveur
// =========================
const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});