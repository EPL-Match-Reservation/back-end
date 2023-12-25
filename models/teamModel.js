const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    name: {
        type: String
    },
    photo: {
      type: String,
    },
  },
  { timestamps: true }
);

const team = mongoose.model("Team", matchSchema);

module.exports = team;
