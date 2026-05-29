const express = require("express");
const router = express.Router();

const utilisateursController = require("../controllers/utilisateurs.controller");
const Utilisateur = require("../models/utilisateurs.model"); // ← chemin corrigé

// =========================
// GET ALL USERS
// =========================
router.get("/users", utilisateursController.getAll);

// =========================
// GET USER BY ID
// =========================
router.get("/users/:id", utilisateursController.getById);

// =========================
// CREATE USER
// =========================
router.post("/users", utilisateursController.createUser);
router.get("/verify/:token", utilisateursController.verifyEmail);

// =========================
// UPDATE USER (PUT)
// - Si l'utilisateur actuel est "internaute" et a maintenant nom + email → "client"
// =========================
router.put(
  "/users/:id",
  async (req, res, next) => {
    try {
      const current = await Utilisateur.findById(req.params.id);
      if (current && current.role === "internaute") {
        const email = req.body.email ?? current.email;
        const nom   = req.body.nom   ?? current.nom;
        if (email && nom) {
          req.body.role = "client";
        }
      }
      next();
    } catch (err) {
      next(err);
    }
  },
  utilisateursController.updateUser
);

// =========================
// DELETE USER
// =========================
router.delete("/users/:id", utilisateursController.deleteUser);

module.exports = router;