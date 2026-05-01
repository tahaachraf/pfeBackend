const express = require("express");
const router = express.Router();

const controller = require("../controllers/produits_complementaires.controller");

// CREATE
router.post("/produits-complementaires", controller.create);

// READ
router.get("/produits-complementaires", controller.getAll);
router.get("/produits-complementaires/:id", controller.getById);

// UPDATE
router.put("/produits-complementaires/:id", controller.update);

// DELETE
router.delete("/produits-complementaires/:id", controller.delete);

module.exports = router;