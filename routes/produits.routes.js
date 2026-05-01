const express = require("express");

const router = express.Router();

const produitsController = require("../controllers/produits.controller");


// CREATE
router.post("/", produitsController.creerProduit);


// READ ALL
router.get("/", produitsController.getProduits);


// READ ONE BY ID
router.get("/id/:id", produitsController.getProduitById);


// READ BY SLUG (SEO)
router.get("/slug/:slug", produitsController.getProduitBySlug);


// UPDATE
router.put("/:id", produitsController.updateProduit);


// DELETE
router.delete("/:id", produitsController.deleteProduit);


module.exports = router;