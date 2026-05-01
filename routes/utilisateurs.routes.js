const express = require("express");
const router = express.Router();

const utilisateursController = require("../controllers/utilisateurs.controller");

// =========================
// GET ALL USERS
// =========================
router.get("/users", utilisateursController.getAll);

// =========================
// GET USER BY ID
// =========================
router.get("/users/:id", utilisateursController.getById);


// =========================
// CREATE USER
// =========================
router.post("/users", utilisateursController.createUser);
router.get("/verify/:token", utilisateursController.verifyEmail);

// =========================
// UPDATE USER (PUT)
// =========================
router.put("/users/:id", utilisateursController.updateUser);
// router.put("verify/:id", utilisateursController.verifyEmail);

// =========================
// DELETE USER
// =========================
router.delete("/users/:id", utilisateursController.deleteUser);

module.exports = router;