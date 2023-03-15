const express = require("express");
const authController = require(`../controllers/authController`);
const userController = require("../controllers/userController");
const listController = require("../controllers/listController");
//
const router = express.Router();

// router.post("/signup", userController.signup);

///////////     For Auth        /////////////////////////
router.post("/signup", authController.signup);
router.post("/signup/verify", authController.verifyEmail);
router.post("/login", authController.login);
router.get("/tokenVerify", authController.tokenVerify);
router.post("/signup/resendOTP", authController.resendOTP);
router.post("/forgotPassword", authController.forgotPass);
router.post("/changePassword", authController.changePassword);
router.post("/changePassword", authController.changePassword);

router.post("/list", listController.addListItem);
router.post("/getList", listController.getListByRole);
/////////       For User        /////////////////////////
router.route("/").get(userController.getAllUsers);
// router.route("/getOne").get(userController.getOneUser);
router
  .route("/")
  .patch(userController.updateUser)
  .delete(userController.delelteUser);

module.exports = router;
