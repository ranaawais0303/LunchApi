const Menu = require("../Models/MenuModel");
const MenuItem = require("../Models/MenuItemModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");
const factory = require("./handleFactory");

exports.createMenu = catchAsync(async (req, res) => {
  const { name, items } = req.body;
  const itemObjectIds = await items.map((id) => mongoose.Types.ObjectId(id));
  const newMenu = new Menu({
    name,
    items: itemObjectIds,
  });
  if (!newMenu) {
    return next(new AppError("Unable to create item"));
  }
  await newMenu.save();
  res.status(201).json(newMenu);
});
exports.updateManu = factory.updateOne(Menu);
