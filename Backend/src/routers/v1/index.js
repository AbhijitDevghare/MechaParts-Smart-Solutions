const express = require("express");
const router = express.Router();

// Import individual route modules
const userRoutes = require("./userRoute.js");
const adminRoutes = require("./adminRoute.js")
const categoryRoute = require("./categoryRoute.js")
// Mount routes
router.use("/user", userRoutes);
router.use("/admin",adminRoutes);
router.use("/category",categoryRoute)

module.exports = router;
