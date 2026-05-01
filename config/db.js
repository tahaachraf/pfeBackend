// const mysql = require("mysql2/promise");

// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "ecommerce",
//   waitForConnections: true,
//   connectionLimit: 10
// });

// module.exports = db;
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connecté");
  } catch (error) {
    console.error("Erreur connexion MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
