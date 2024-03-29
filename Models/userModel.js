const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please tell us first name"],

    // maxlength: [40, "A User's Name must have less or equal then 40 char"],
    minlength: [1, "A User's Name must have more or equal then 6 char"],
  },
  lastName: {
    type: String,
    required: [true, "Please tell us your name"],
    // required: false,
    // maxlength: [40, "A User's Name must have less or equal then 40 char"],
    minlength: [1, "A User's Name must have more or equal then 6 char"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,

  role: {
    type: String,
    // enum: ["user", "guide", "lead-guide", "admin"],
    default: "User",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },

  ////for otp setting
  created: {
    type: Date,
    default: new Date().toISOString(),
  },
  lastActive: {
    type: String,
    required: false,
  },
  forgot: {
    type: Boolean,
    default: false,
  },
  tokenExp: {
    type: String,
    default: "60s",
  },
  verifiedEmail: {
    type: Boolean,
    default: false,
  },
  adminVarified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  otp: {
    type: String,
    required: true,
  },
});
//pre save
userSchema.pre("save", async function (next) {
  //only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

////////check password is correct /////////////
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model("users", userSchema);
module.exports = User;
