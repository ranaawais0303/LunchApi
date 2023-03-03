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
