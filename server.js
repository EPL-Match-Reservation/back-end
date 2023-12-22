const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// on exception
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err);
  process.exit(1);
});

const app = require("./app");

if (process.env.NODE_ENV === "production") {
  const DB = process.env.DATABASE;
  mongoose.connect(DB);
} else {
  const DB = process.env.DATABASE;
  mongoose.connect(DB).then(() => console.log("DB connection successful!"));
}

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
