const mongoose = require("mongoose");

const stadiumSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    rows: { type: Number, required: true, min: 1, max: 10 },
    columns: { type: Number, required: true, min: 1, max: 30 },
  },
  { timestamps: true }
);

const Stadium = mongoose.model("Stadium", stadiumSchema);
module.exports = Stadium;
