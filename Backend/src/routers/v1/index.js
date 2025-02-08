const express = require("express");
const router = express.Router();

// Import individual route modules
const userRoutes = require("./userRoutes.js");

// Mount routes
router.use("/user", userRoutes);

module.exports = router;
