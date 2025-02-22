const express = require("express");
const jwtAuth = require("../../middleware/jwtAuth");
const {categoryController} = require("../../controllers/index");
const isAdminCheck = require("../../middleware/isAdminCheck");
const router = express.Router();

router.post("/addCategory",jwtAuth,isAdminCheck,categoryController.addCategory)
router.delete("/deleteCategory",jwtAuth,isAdminCheck,categoryController.deleteCategory)
router.get("/getCategory",jwtAuth,categoryController.getCategories)



module.exports = router