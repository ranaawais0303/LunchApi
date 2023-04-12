const mongoose = require("mongoose");

const addonsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});
const Addons = mongoose.model("addons", addonsSchema);
module.exports = Addons;
