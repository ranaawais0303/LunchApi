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
  if (req.body.role === "User") {
    const arr = await list[0].items
      .map((item) => item)
      .filter((show) => show.role === "User");
    //   .filter((show) => show.role === "User");

    res.status(200).json({ status: "Success", data: arr });
  } else {
    const arr = await list[0].items.map((item) => item);
    res.status(200).json({
      status: "Success",
      data: arr,
    });
  }
});
