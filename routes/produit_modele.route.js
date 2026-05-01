const express = require("express");
const router = express.Router();

const controller = require("../controllers/produit_modele.controller");

// CREATE
router.post("/produit-modele", controller.create);

// READ
router.get("/produit-modele", controller.getAll);
router.get("/produit-modele/:id", controller.getById);

// UPDATE
router.put("/produit-modele/:id", controller.update);

// DELETE
router.delete("/produit-modele/:id", controller.delete);

module.exports = router;