const express = require("express");
const router = express.Router();

const piecesController = require("../controllers/pieces_jointes.controller");

// CREATE
router.post("/pieces-jointes", piecesController.create);

// READ
router.get("/pieces-jointes", piecesController.getAll);
router.get("/pieces-jointes/:id", piecesController.getById);

// UPDATE
router.put("/pieces-jointes/:id", piecesController.update);

// DELETE
router.delete("/pieces-jointes/:id", piecesController.delete);

module.exports = router;