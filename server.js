const mongoose = require("mongoose");
const dotenv = require(`dotenv`);

const app = require(`./app`);

/////set environment variables here
dotenv.config({ path: "config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

//connection with database

mongoose.connect(DB).catch((error) => console.error(error));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}...`);
  console.log("db connection successful");
});
