const List = require("../Models/listModel");
const catchAsync = require("../utils/catchAsync");

exports.addListItem = catchAsync(async (req, res) => {
  const list = await List.findById(req.body.id);
  if (list) {
    list.items.push({ name: req.body.name, role: req.body.role });
    await list.save();
    res.send(list);
  }
});
exports.getListByRole = catchAsync(async (req, res) => {
  const list = await List.find();
  console.log(list, "list getlistby role");
  if (req.body.role === "User") {
    const arr = await list[0].items
      .map((item) => item)
      .filter((show) => show.role === "User");
    //   .filter((show) => show.role === "User");

    console.log(arr, "inside if statement");

    res.send(arr);
  } else {
    const arr = await list[0].items;
    res.send(arr);
  }
});
