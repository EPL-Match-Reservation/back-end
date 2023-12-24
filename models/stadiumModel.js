const mongoose = require("mongoose");

const stadiumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    rows: { type: Number },
    columns: { type: Number },
  },
  { timestamps: true }
);

const Stadium = mongoose.model("Stadium", stadiumSchema);
module.exports = Stadium;
