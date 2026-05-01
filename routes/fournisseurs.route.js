// routes/fournisseurs.route.js

const express = require("express");
const router = express.Router();

const fournisseursController = require("../controllers/fournisseurs.controller");


// GET ALL
router.get("/fournisseurs", fournisseursController.getAll);


// GET ONE
router.get("/fournisseurs/:id", fournisseursController.getOne);


// CREATE
router.post("/fournisseurs", fournisseursController.create);


// UPDATE
router.put("/fournisseurs/:id", fournisseursController.update);


// DELETE
router.delete("/fournisseurs/:id", fournisseursController.delete);


module.exports = router;