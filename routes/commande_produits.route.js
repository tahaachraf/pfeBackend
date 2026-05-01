const express = require("express");
const router = express.Router();

const controller = require("../controllers/commande_produits.controller");

// CREATE
router.post("/commande-produits", controller.create);

// READ
router.get("/commande-produits", controller.getAll);
router.get("/commande-produits/:id", controller.getById);

// UPDATE
router.put("/commande-produits/:id", controller.update);

// DELETE
router.delete("/commande-produits/:id", controller.delete);

module.exports = router;