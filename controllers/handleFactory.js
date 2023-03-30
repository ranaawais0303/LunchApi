const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

////     Delete function for user item etc general function      /////

//delete
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.body.id, {
      isActive: false,
    });

    console.log(doc, "____active");
    if (!doc) {
      return next(new AppError("No doc found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

//////      General update function     ///////////////////////////
/////update
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //new for new value which edit
    //runValidator for schema which fixed
    //req.body mean edit body where edit any value

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log(req.params.id, "update function");
    if (!doc) {
      return next(new AppError("No document found with that ID"));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

////////////      Get All         ///////////////////////////
exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    const doc = await Model.find({ isActive: { $ne: false } });
    //SEND RESPONSE
    console.log("Get All", doc);
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  });

//////////   Get One        ////////////////////////////
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.body.id);
    if (popOptions) query = query.populate(popOptions);
    //
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      menu: doc,
    });
  });
