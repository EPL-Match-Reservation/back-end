const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    stadium: { type: mongoose.Schema.Types.ObjectId, ref: "Stadium" },
    HomeTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    AwayTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    MatchDate: {
      type: Date,
    },
    MatchTime: {
      type: String,
    },
    MainReferee: {
      type: String,
    },
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

const match = mongoose.model("Match", matchSchema);

module.exports = match;
