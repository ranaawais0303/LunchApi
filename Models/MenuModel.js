const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  current: {
    type: Boolean,
    default: false,
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
});
const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
