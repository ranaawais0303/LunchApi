const Menu = require("../Models/MenuModel");
const MenuItem = require("../Models/MenuItemModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const mongoose = require("mongoose");
const factory = require("./handleFactory");
const { ObjectId } = require("mongoose");
////////////////        Create Manu        //////////////////
exports.createMenu = catchAsync(async (req, res) => {
  const { name, items } = req.body;
  const itemObjectIds = await items.map((id) => mongoose.Types.ObjectId(id));
  const newMenu = new Menu({
    name,
    items: itemObjectIds,
  });
  if (!newMenu) {
    return next(new AppError("Unable to create Menu"));
  }
  await newMenu.save();
  res.status(201).json(newMenu);
});

///////////////     Add item into manu      //////////////
exports.addItemIntoMenu = catchAsync(async (req, res) => {
  const { menuId, itemId } = req.body;
  const itemIdExistance = await MenuItem.findById(itemId);
  if (!itemIdExistance) {
    return next(new AppError("item is not exist in the item table"));
  }

  const itemObjectId = await mongoose.Types.ObjectId(itemId);
  const menu = await Menu.findByIdAndUpdate(menuId, {
    $push: { items: itemObjectId },
  });
  if (!menu) {
    return next(new AppError("menu not exist"));
  }
  console.log("here is out item", menu);
  res.status(201).json(menu);
});

exports.updateManu = factory.updateOne(Menu);
exports.deleteMenu = factory.deleteOne(Menu);
exports.getMenus = factory.getAll(Menu);

/////////////////Get one Menu with populate items array /////
//populate open the array ///
exports.getOneMenu = factory.getOne(Menu, "items");
