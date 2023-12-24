const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    stadium: { type: mongoose.Schema.Types.ObjectId, ref: "Stadium" },
    HomeTeam: {
      type: String,
      // required: true,
    },
    AwayTeam: {
      type: String,
      // required: true,
    },
    MatchDate: {
      type: Date,
      // required: true,
    },
    MatchTime: {
      type: String,
      // required: true,
    },
    MainReferee: {
      type: String,
      // required: true,
    },
    // Linesmen: linesmanSchema,
    linesman1: {
      type: String,
    },
    linesman2: {
      type: String,
    },
    reservedSeats: [{ type: Number }],
  },
  { timestamps: true }
);

const match = mongoose.model("match", matchSchema);

module.exports = match;
