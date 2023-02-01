//////////////
const User = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
const { generateOTP } = require("../services/otp");
const { sendMail } = require("../services/Mail");
//SignUp User
exports.signup = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const isExisting = await findUserByEmail(email);
  if (isExisting) {
    return res.status(409).send({ message: "Already existing" });
  }

  //create new user
  const newUser = await createUser(firstName, lastName, email, password);
  if (!newUser[0]) {
    return res.status(400).send({
      message: "Unable to create new user",
    });
  }
  res.send(newUser);
});

/////create user function
const createUser = async (firstName, lastName, email, password) => {
  const otpGenerated = generateOTP();

  const newUser = await User.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,

    otp: otpGenerated,
  });
  if (!newUser) {
    return [false, "Unable to sign you up"];
  }
  try {
    await sendMail({
      to: email,
      OTP: otpGenerated,
    });
    return [true, newUser];
  } catch (error) {
    return [false, "Unable to sign up, Please try again later", error];
  }
};

/////////varify email
module.exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  const user = await validateUserSignUp(email, otp, res);
  if (user[0]) {
    res.send(user);
  } else {
    res.status(404).send(user);
  }
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({
    email,
  });
  if (!user) {
    return false;
  }
  return user;
};

///validate function
const validateUserSignUp = async (email, otp, res) => {
  const user = await User.findOne({
    email,
  });
  if (!user) {
    // res.status(404).send({ status: false, message: "User not found" });
    return [false, "User not found"];
  } else if (user && user.otp !== otp) {
    console.log("otp not available");
    // res.status(401).send({ status: false, message: "Invalid attept" });

    return [false, "Invalid OTP"];
  }
  const updatedUser = await User.findByIdAndUpdate(user._id, {
    $set: { active: true },
  });
  return [true, updatedUser];
};
