const express = require("express");
const router = express.Router();

const controller = require("../controllers/produits_fournisseurs.controller");

// CREATE
router.post("/produits-fournisseurs", controller.create);

// READ
router.get("/produits-fournisseurs", controller.getAll);
router.get("/produits-fournisseurs/:id", controller.getById);

// UPDATE
router.put("/produits-fournisseurs/:id", controller.update);

// DELETE
router.delete("/produits-fournisseurs/:id", controller.delete);

module.exports = router;