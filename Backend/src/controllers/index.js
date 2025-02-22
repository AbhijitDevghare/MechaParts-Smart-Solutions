const PaymentController = require("./paymentController.js");
const userController = require("./userControllers/userControllers.js");
const adminController = require("./userControllers/adminControllers.js")
const categoryController = require("./productControllers/categoryController.js")

module.exports = {
  userController,
  PaymentController,
  adminController,
  categoryController
};
