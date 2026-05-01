// routes/marques.route.js

const express = require("express");
const router = express.Router();
const marquesController = require("../controllers/marques.controller");


/**
 * GET ALL
 */
router.get("/marques", marquesController.getAll);


/**
 * GET ONE
 */
router.get("/marques/:id", marquesController.getOne);


/**
 * CREATE
 */
router.post("/marques", marquesController.create);


/**
 * UPDATE
 */
router.put("/marques/:id", marquesController.update);


/**
 * DELETE
 */
router.delete("/marques/:id", marquesController.delete);


module.exports = router;