const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");

// Auth publique
router.post("/login", controller.login);
router.post("/register", controller.register);

// ⚠️ uniquement pour tests (à supprimer en prod)
router.post("/create-admin", controller.createAdmin);

module.exports = router;
