// routes/commandes.route.js

const express = require("express");
const router = express.Router();

const commandesController = require("../controllers/commandes.controller");


// GET ALL
router.get("/commandes", commandesController.getAll);


// GET ONE
router.get("/commandes/:id", commandesController.getOne);


// CREATE
router.post("/commandes", commandesController.create);


// UPDATE
router.put("/commandes/:id", commandesController.update);


// DELETE
router.delete("/commandes/:id", commandesController.delete);


module.exports = router;