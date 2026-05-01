// routes/categories.routes.js
const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categories.controller");

/**
 * GET ALL
 */
router.get("/categories", categoriesController.getAll);

/**
 * GET ONE
 */
router.get("/categories/:id", categoriesController.getOne);

/**
 * CREATE
 */
router.post("/categories", categoriesController.create);

/**
 * UPDATE
 */
router.put("/categories/:id", categoriesController.update);

/**
 * DELETE
 */
router.delete("/categories/:id", categoriesController.delete);

module.exports = router;