const MenuItem = require("../Models/MenuItemModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("../controllers/handleFactory");
exports.createItem = catchAsync(async (req, res) => {
  const { name, description, price } = req.body;

  const newItem = new MenuItem({
    name,
    description,
    price,
  });
  if (!newItem) {
    return next(new AppError("Unable to create item"));
  }
  await newItem.save();
  res.status(201).json(newItem);
});
exports.updateItem = factory.updateOne(MenuItem);
exports.deleteItem = factory.deleteOne(MenuItem);
exports.getItems = factory.getAll(MenuItem);
exports.getOneItem = factory.getOne(MenuItem);
