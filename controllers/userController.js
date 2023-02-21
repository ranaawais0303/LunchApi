//////////////
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const User = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
const { generateOTP } = require("../services/otp");
const { sendMail } = require("../services/Mail");
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");

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

///////////////////   varify Token    /////////////////////
exports.tokenVerify = catchAsync(async (req, res, next) => {
  // const { token } = req.body;
  // try {
  //   const user = jwt.verify(token, secret, expireTime);
  //   // const myuser = User.findOne(user.id);
  //   console.log(user);
  //   res.send(user);
  // } catch (err) {
  //   console.log(err);
  // }
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! please log in to get access.", 401)
    );
  }

  //2) Verification token
  //about expiration of token
  const decoded = await promisify(jwt.verify)(token, secret);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token does no longer exist", 401)
    );
  }
  res.send(decoded);
});

/////////////////////     SignUp User    ///////////////////////////

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

const findUserByEmail = async (email) => {
  const user = await User.findOne({
    email,
  });
  if (!user) {
    return false;
  }
  return user;
};

//////////////////////////   Resend OTP      //////////////////////////
exports.resendOTP = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const otpGenerated = generateOTP();

  const user = await User.findOne({
    email,
  });
  const updatedUserOtp = await User.findByIdAndUpdate(user._id, {
    $set: { otp: otpGenerated },
  });
  try {
    await sendMail({
      to: email,
      OTP: otpGenerated,
      title: "You are officially In ✔",
      message: "Please enter the sign up OTP to get started",
    });
    res.send(updatedUserOtp);
  } catch (error) {
    return next(new AppError("Bad Network", 404));
  }
});
/////////////////////////    varify email   //////////////////////////
/////////
module.exports.verifyEmail = async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await validateUserSignUp(email, otp);
  if (user[0]) {
    res.send(user);
  } else {
    res.status(404).send(user);
  }
};

///validate function
const validateUserSignUp = async (email, otp) => {
  const user = await User.findOne({
    email,
  });
  if (!user) {
    return [false, "User not found"];
  } else if (user && user.otp !== otp) {
    console.log("otp not available");

    return [false, "Invalid OTP"];
  }
  const updatedUser = await User.findByIdAndUpdate(user._id, {
    $set: { active: true },
  });
  return [true, updatedUser];
};

///////////////////     LOGIN EXISTING USER   /////////////////////
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //2)Check if user exist && password is correct
  const user = await User.findOne({ email }).select("+password");
  console.log(user.active, "===================");
  const active = user.active;

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  if (
    user &&
    (await user.correctPassword(password, user.password)) &&
    active === false
  ) {
    return next(new AppError("Please varify your account ", 422));
  }

  //3)if everthing ok, send token to client
  const token = signToken(user._id);

  console.log(token);
  res.status(200).json({
    status: "Success",
    token,
  });
});

/////////////////////   FORGOT PASSWORD   ///////////////////////////////
exports.forgotPass = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const otpGenerated = generateOTP();

  const incryptedPassword = await bcrypt.hash(otpGenerated, 12);

  const user = await User.findOne({
    email,
  });
  // .select("+password");
  if (!user) {
    return next(new AppError("No user is available with this email", 401));
  }
  const updatedUserPassword = await User.findByIdAndUpdate(user._id, {
    $set: { password: incryptedPassword },
  });
  await User.findByIdAndUpdate(user._id, {
    $set: { forgot: true },
  });
  try {
    await sendMail({
      to: email,
      OTP: otpGenerated,
      title: "Forgot Password",
      message:
        "Please enter this password in password field to change the password",
    });

    res.send(updatedUserPassword);
  } catch (error) {
    return next(new AppError("Bad Network", 404));
  }
});

///////////////////   Update Password   ////////////////////////////////
exports.changePassword = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const incryptedPassword = await bcrypt.hash(password, 12);

  const user = await User.findOne({
    email,
  });
  await User.findByIdAndUpdate(user._id, {
    $set: { forgot: false },
  });
  if (!user) {
    return next(new AppError("No user is available with this email", 401));
  }
  const updatedUserPassword = await User.findByIdAndUpdate(user._id, {
    $set: { password: incryptedPassword },
  });
  try {
    res.send(updatedUserPassword);
  } catch (err) {
    return next(new AppError("Bad Network", 404));
  }
});
