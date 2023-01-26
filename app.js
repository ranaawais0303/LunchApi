const express = require("express");
const cors = require("cors");

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
module.exports = app;
