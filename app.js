const express = require("express");
const app = express();

// Middleware global
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/utilisateurs", require("./routes/utilisateurs.routes"));

// Route test
app.get("/", (req, res) => {
  res.send("API Ecommerce OK ✅");
});

module.exports = app;
