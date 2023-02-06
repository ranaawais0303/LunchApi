//////////////
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
const { generateOTP } = require("../services/otp");
const { sendMail } = require("../services/Mail");
const AppError = require("../utils/appError");

//////////////////////////////////////////////
//Create token/////
const secret = process.env.JWT_SECRET;
const expireTime = process.env.JWT_EXPIRES_IN;
const signToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    secret,
    { expiresIn: expireTime }
  );
};

//Login existing user
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //2)Check if user exist && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //3)if everthing ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: "Success",
    token,
  });
});

//SignUp User
exports.signup = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  const isExisting = await findUserByEmail(email);
  if (isExisting) {
    return next(new AppError("Email is Already exist", 409));
  }

  //create new user
  const newUser = await createUser(firstName, lastName, email, password);
  if (!newUser[0]) {
    return next(new AppError("Email is Already exist", 400));
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
module.exports.verifyEmail = async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await validateUserSignUp(email, otp);
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
const validateUserSignUp = async (email, otp) => {
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

////////////////////////////////////////
//LOGIN EXISTING USER
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //2)Check if user exist && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  //3)if everthing ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: "Success",
    token,
  });
});
