const express = require("express");
const router = express.Router();

const controller = require("../controllers/produit_marque.controller");

// CREATE
router.post("/produit-marque", controller.create);

// READ
router.get("/produit-marque", controller.getAll);
router.get("/produit-marque/:id", controller.getById);

// UPDATE
router.put("/produit-marque/:id", controller.update);

// DELETE
router.delete("/produit-marque/:id", controller.delete);

module.exports = router;