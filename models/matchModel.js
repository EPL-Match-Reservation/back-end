const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    stadium: { type: mongoose.Schema.Types.ObjectId, ref: "Stadium" },
    homeTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    awayTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    matchDate: {
      type: Date,
    },
    matchTime: {
      type: String,
    },
    mainReferee: {
      type: String,
    },
    linesman1: {
      type: String,
    },
    linesman2: {
      type: String,
    },
    reservedSeats: [
      {
        type: Array,
        items: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

const match = mongoose.model("Match", matchSchema);

module.exports = match;
