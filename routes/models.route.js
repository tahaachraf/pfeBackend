// routes/models.route.js

const express = require("express");
const router = express.Router();
const modelsController = require("../controllers/models.controller");

/**
 * GET ALL
 */
router.get("/models", modelsController.getAll);

/**
 * GET ONE
 */
router.get("/models/:id", modelsController.getOne);

/**
 * CREATE
 */
router.post("/models", modelsController.create);

/**
 * UPDATE
 */
router.put("/models/:id", modelsController.update);

/**
 * DELETE
 */
router.delete("/models/:id", modelsController.delete);

module.exports = router;