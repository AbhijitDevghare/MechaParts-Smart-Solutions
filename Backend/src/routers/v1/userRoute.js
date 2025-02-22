const express = require("express");
const router = express.Router();
const { userController } = require("../../controllers/index.js");
const upload = require("../../middleware/multer.js");
const jwtAuth = require("../../middleware/jwtAuth.js");

// Authentication Routes
router.post("/auth/register", upload.single("avatar"), userController.register);
router.post("/auth/login", userController.login);
router.get("/auth/logout", userController.logout);

// User Profile Routes
router.put("/profile", jwtAuth, upload.single("avatar"), userController.updateUserProfile);
router.put("/profile/avatar", jwtAuth, upload.single("avatar"), userController.updateAvatar);
router.get("/getuser", jwtAuth, userController.getuser);

// Password Reset Routes
router.post("/password/forgot/verify-email", userController.forgetPassword);
router.post("/password/forgot/send-otp", userController.sendOtp);
router.post("/password/reset/verify-otp", userController.verifyOtp);
router.put("/password/reset/:resetToken", userController.resetPassword);

module.exports = router;
