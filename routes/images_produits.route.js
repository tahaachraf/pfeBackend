// routes/images_produits.route.js

const express = require("express");
const router = express.Router();

const imagesController = require("../controllers/images_produits.controller");


// GET ALL
router.get("/images-produits", imagesController.getAll);


// GET ONE
router.get("/images-produits/:id", imagesController.getOne);


// CREATE
router.post("/images-produits", imagesController.create);


// UPDATE
router.put("/images-produits/:id", imagesController.update);


// DELETE
router.delete("/images-produits/:id", imagesController.delete);


module.exports = router;