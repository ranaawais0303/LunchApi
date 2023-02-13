const express = require("express");
const userController = require(`../controllers/userController`);
//
const router = express.Router();

// router.post("/signup", userController.signup);
router.post("/signup", userController.signup);
router.post("/signup/varify", userController.verifyEmail);
router.post("/login", userController.login);
router.post("/signup/resendOTP", userController.resendOTP);

module.exports = router;
