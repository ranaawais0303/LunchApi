const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
    // maxlength: [40, "A User's Name must have less or equal then 40 char"],
    // minlength: [6, "A User's Name must have more or equal then 6 char"],
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
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        //this only works on CREATE and SAVE not on update etc
        return el === this.password;
      },
      message: "Confirm Password ({VALUE}) should be  Equal to  password",
    },
  },
  //   passwordChangedAt: Date,

  //   passwordResetToken: String,
  //   passwordResetExpires: Date,

  //   active: {
  //     type: Boolean,
  //     default: true,
  //     select: false,
  //   },
});

const User = mongoose.model("users", userSchema);
module.exports = User;
