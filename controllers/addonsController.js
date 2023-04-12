const Addons = require("../Models/addonsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("../controllers/handleFactory");
exports.createItem = catchAsync(async (req, res) => {
  const { name, description, price } = req.body;

  const newItem = new Addons({
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
exports.updateItem = factory.updateOne(Addons);
exports.deleteItem = factory.deleteOne(Addons);
exports.getItems = factory.getAll(Addons);
exports.getOneItem = factory.getOne(Addons);
