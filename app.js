const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/userRoutes");
const MenuRouter = require("./routes/MenuRoutes");
const AddonsRouter = require("./routes/AddonsRoutes");
const AppError = require("./utils/appError");

///Server startup
const app = express();
app.get("/", (req, res) => {
  res.status(200).send("Hellow from the server side");
});

///for all type of frontend
app.use(
  cors({
    origin: "*",
  })
);
//
////express.json is middleware////
//Body parser, reading data form body into req.body
app.use(express.json({ limit: "10kb" }));

//Mounting the router
app.use("/api/users", userRouter);
app.use("/api/Menu", MenuRouter);
app.use("/api/Addons", AddonsRouter);

//unhandled url or route came from moslty catchAsync
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//////
module.exports = app;
