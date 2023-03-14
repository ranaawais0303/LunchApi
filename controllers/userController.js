const factory = require("./handleFactory");
const User = require("../Models/userModel");
////////    only deactivate user    ///////////
// exports.softDel = factory.deleteMe(User);
////////    deleteUser    /////////////////////
exports.delelteUser = factory.deleteOne(User);

///////    Update User    ////////////////////
exports.updateUser = factory.updateOne(User);

//////    Get All Users   ///////////////////
exports.getAllUsers = factory.getAll(User);
exports.list2 = (req, res) => {
  const list = [
    {
      id: 1,
      name: "Users",
    },
    {
      id: 2,
      role: "User",
      name: "Menu",
    },
    {
      id: 3,
      name: "User Verification",
    },
    {
      id: 4,
      name: "Orders",
    },
    {
      id: 5,
      name: "Addons",
    },
    {
      id: 6,
      name: "Notifications",
    },
  ];

  if (req.role === "User") {
    const arr = list.filter((show) => show.role === "User");
    res.send(arr);
    console.log(arr);
  }
};
