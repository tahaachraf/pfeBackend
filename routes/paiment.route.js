const express = require("express");
const router = express.Router();

const controller = require("../controllers/paiment.controller");

// CREATE
router.post("/paiment", controller.create);

// READ
router.get("/paiment", controller.getAll);
router.get("/paiment/:id", controller.getById);

// UPDATE
router.put("/paiment/:id", controller.update);

// DELETE
router.delete("/paiment/:id", controller.delete);

module.exports = router;