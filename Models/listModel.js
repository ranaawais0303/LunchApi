const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us name"],

    // maxlength: [40, "A User's Name must have less or equal then 40 char"],
    minlength: [1, "A Item's Name must have more or equal then 6 char"],
  },
  role: {
    type: String,
  },
});

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  items: [ItemSchema],

  created: {
    type: Date,
    default: new Date().toISOString(),
  },
});
const List = mongoose.model("lists", listSchema);
module.exports = List;
