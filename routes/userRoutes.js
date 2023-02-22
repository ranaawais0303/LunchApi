const express = require("express");
const authController = require(`../controllers/authController`);
//
const router = express.Router();

// router.post("/signup", userController.signup);
router.post("/signup", authController.signup);
router.post("/signup/varify", authController.verifyEmail);
router.post("/login", authController.login);
router.get("/tokenVarify", authController.tokenVerify);
router.post("/signup/resendOTP", authController.resendOTP);
router.post("/forgotPassword", authController.forgotPass);
router.post("/changePassword", authController.changePassword);

module.exports = router;
