//////////////
const User = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
//SignUp User
exports.signup = (req, res, next) => {
  console.log(req.body);
  const newUser = User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });
  res.send("asjdkAJSD Ajsd");
};
