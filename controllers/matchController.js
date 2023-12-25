const Match = require("../models/matchModel");
const Team = require("../models/teamModel");
const Stadium = require("../models/stadiumModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.getMatch = async (req, res) => {
  try {
    const matchID = req.params.id;
    // if env is dev
    if (process.env.NODE_ENV === "development") {
      console.log(matchID);
    }
    // get the user
    const match = await Match.findOne({
      _id: matchID,
    }).populate("stadium")
    .populate("homeTeam")
    .populate("awayTeam");
    // if the user is not found
    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    return res
      .status(200)
      .json({ message: "Successful get user", data: match });
  } catch (error) {
    console.error("Error getting match:", error);

    return res.status(400).json({ error: "Internal server error" });
  }
};

module.exports.retrievematches = async (req, res) => {
  try {
    // get all matches with populated home and away teams
    const matches = await Match.find()
      .populate("stadium")
      .populate("homeTeam")
      .populate("awayTeam");

    // if no matches
    if (!matches) {
      return res.status(404).json({ error: "No matches found" });
    }

    return res
      .status(200)
      .json({ message: "Successful get matches", data: matches });
  } catch (error) {
    console.error("Error getting match:", error);

    return res.status(400).json({ error: "Internal server error" });
  }
};

module.exports.createMatch = async (req, res) => {
  try {
    // get the role of the requeseter form the token
    const token = req.headers["authorization"];
    // if token is undefined
    if (!token) {
      return res.status(400).json({ message: "You are not logged in" });
    }
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    const role = decoded.role;
    // if env is dev
    if (process.env.NODE_ENV === "development") {
      console.log(req.body);
    }
    //check if the user is admin
    if (role !== "Manager") {
      return res.status(400).json({ message: "You are not an Manager" });
    }
    const {
      stadium,
      homeTeam,
      awayTeam,
      matchDate,
      matchTime,
      mainReferee,
      linesman1,
      linesman2,
    } = req.body;
    // print reqbody
    if (process.env.NODE_ENV === "development") {
      console.log(req.body);
    }
    // get the home team
    const HomeTeam = await Team.findById(homeTeam);
    if (!HomeTeam) {
      return res.status(400).json({ message: "HomeTeam not found" });
    }
    // get the away team
    const AwayTeam = await Team.findById(awayTeam);
    if (!AwayTeam) {
      return res.status(400).json({ message: "AwayTeam not found" });
    }
    // check if the stadium exists
    // get the stadium id from the stadium name
    const dbstadium = await Stadium.findById(stadium);
    if (!dbstadium) {
      return res.status(400).json({ message: "stadium not found" });
    }
    // check if the data is oldone
    const currentTime_date = new Date();
    const matchDateTime_date = new Date(matchDate);
    if (matchDateTime_date < currentTime_date) {
      return res.status(400).json({ message: "match date is old" });
    }
    //check if staduium is available on the same MatchDate
    const match1 = await Match.findOne({
      stadium: dbstadium._id,
      matchDate: matchDate,
    });
    if (match1) {
      // Extract hours and minutes from MatchTime
      let matchTimeArray = matchTime.split(":");
      let matchTimeHours = parseInt(matchTimeArray[0], 10);
      let matchTimeMinutes = parseInt(matchTimeArray[1], 10);
      let matchDateTime = new Date();
      matchDateTime.setHours(matchTimeHours, matchTimeMinutes, 0, 0);

      // Extract hours and minutes from MatchTime
      matchTimeArray = match1.matchTime.split(":");
      matchTimeHours = parseInt(matchTimeArray[0], 10);
      matchTimeMinutes = parseInt(matchTimeArray[1], 10);
      currentTime_match = new Date();
      currentTime_match.setHours(matchTimeHours, matchTimeMinutes, 0, 0);
      // Calculate the time difference in milliseconds
      const timeDifference = Math.abs(matchDateTime - currentTime_match);
      // check availability
      if (timeDifference <= 3 * 60 * 1000) {
        return res.status(400).json({ message: "stadium is not available" });
      }
    }
    //check if HomeTeam or AwayTeam have match on the same MatchDate
    const match2 = await Match.findOne({
      $or: [
        { homeTeam: HomeTeam._id, matchDate: matchDate },
        { awayTeam: AwayTeam._id, matchDate: matchDate },
      ],
    });
    if (match2) {
      return res.status(400).json({
        message: "HomeTeam or AwayTeam have match on the same MatchDate",
      });
    }
    //HomeTeam and AwayTeam can't be the same
    if (homeTeam == awayTeam) {
      return res
        .status(400)
        .json({ message: "HomeTeam and AwayTeam can not be the same" });
    }
    if (!homeTeam || !awayTeam) {
      return res
        .status(400)
        .json({ error: "please enter home team and away team" });
    }
    if (!linesman2 || !linesman1) {
      return res.status(400).json({ error: "please enter both linesmen" });
    }
    if (!mainReferee) {
      return res.status(400).json({ error: "please enter MainReferee name" });
    }
    const match = new Match({
      stadium: dbstadium._id,
      homeTeam: HomeTeam._id,
      awayTeam: AwayTeam._id,
      matchDate,
      matchTime,
      mainReferee,
      linesman1,
      linesman2,
    });
    // create 2d array of zeros
    let reservedSeats = Array.from({ length: dbstadium.rows }, () => Array(dbstadium.columns).fill(0));
    match.reservedSeats = reservedSeats;
    const newMatch = await match.save();
    return res.status(201).json({ data: newMatch });
  } catch (error) {
    console.error("Error creating match:", error);

    return res.status(400).json({ error: "Internal server error" });
  }
};

module.exports.updateMatch = async (req, res) => {
  try {
    // get the role of the requeseter form the token
    const token = req.headers["authorization"];
    // if token is undefined
    if (!token) {
      return res.status(400).json({ message: "You are not logged in" });
    }
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    const role = decoded.role;
    // if env is dev
    if (process.env.NODE_ENV === "development") {
      console.log(req.body);
    }
    //check if the user is admin
    if (role !== "Manager") {
      return res.status(400).json({ message: "You are not an Manager" });
    }
    const id = req.params.id;
    const match = await Match.findById(id);
    if (!match) {
      return res.status(400).json({ message: "match not found" });
    }
    const {
      stadium,
      homeTeam,
      awayTeam,
      matchDate,
      matchTime,
      mainReferee,
      linesman1,
      linesman2,
    } = req.body;
    // print reqbody
    if (process.env.NODE_ENV === "development") {
      console.log(req.body);
    }
    // get the home team
    const HomeTeam = await Team.findById(homeTeam);
    if (!HomeTeam) {
      return res.status(400).json({ message: "HomeTeam not found" });
    }
    // get the away team
    const AwayTeam = await Team.findById(awayTeam);
    if (!AwayTeam) {
      return res.status(400).json({ message: "AwayTeam not found" });
    }
    // check if the stadium exists
    // get the stadium id from the stadium name
    const dbstadium = await Stadium.findById(stadium);
    if (!dbstadium) {
      return res.status(400).json({ message: "stadium not found" });
    }
    // check if the data is oldone
    const currentTime_date = new Date();
    const matchDateTime_date = new Date(matchDate);
    if (matchDateTime_date < currentTime_date) {
      return res.status(400).json({ message: "match date is old" });
    }
    //check if staduium is available on the same MatchDate
    const match1 = await Match.findOne({
      stadium: dbstadium._id,
      matchDate: matchDate,
    });
    if (match1) {
      // Extract hours and minutes from MatchTime
      let matchTimeArray = matchTime.split(":");
      let matchTimeHours = parseInt(matchTimeArray[0], 10);
      let matchTimeMinutes = parseInt(matchTimeArray[1], 10);
      let matchDateTime = new Date();
      matchDateTime.setHours(matchTimeHours, matchTimeMinutes, 0, 0);

      // Extract hours and minutes from MatchTime
      matchTimeArray = match1.matchTime.split(":");
      matchTimeHours = parseInt(matchTimeArray[0], 10);
      matchTimeMinutes = parseInt(matchTimeArray[1], 10);
      currentTime_match = new Date();
      currentTime_match.setHours(matchTimeHours, matchTimeMinutes, 0, 0);
      // Calculate the time difference in milliseconds
      const timeDifference = Math.abs(matchDateTime - currentTime_match);
      // check availability
      if (timeDifference <= 3 * 60 * 1000) {
        return res.status(400).json({ message: "stadium is not available" });
      }
    }
    //check if HomeTeam or AwayTeam have match on the same MatchDate
    const match2 = await Match.findOne({
      $or: [
        { homeTeam: HomeTeam._id, matchDate: matchDate },
        { awayTeam: AwayTeam._id, matchDate: matchDate },
      ],
    });
    if (match2) {
      return res.status(400).json({
        message: "HomeTeam or AwayTeam have match on the same MatchDate",
      });
    }
    //HomeTeam and AwayTeam can't be the same
    if (homeTeam == awayTeam) {
      return res
        .status(400)
        .json({ message: "HomeTeam and AwayTeam can not be the same" });
    }
    if (!homeTeam || !awayTeam) {
      return res
        .status(400)
        .json({ error: "please enter home team and away team" });
    }
    if (!linesman2 || !linesman1) {
      return res.status(400).json({ error: "please enter both linesmen" });
    }
    if (!mainReferee) {
      return res.status(400).json({ error: "please enter MainReferee name" });
    }
    const match_new = new Match({
      stadium: dbstadium._id,
      homeTeam: HomeTeam._id,
      awayTeam: AwayTeam._id,
      matchDate,
      matchTime,
      mainReferee,
      linesman1,
      linesman2,
    });
    // replace the old match with the new
    try {
      const result = await Match.replaceOne(
        { _id: id },
        {
          stadium: dbstadium._id,
          homeTeam: HomeTeam._id,
          awayTeam: AwayTeam._id,
          matchDate,
          matchTime,
          mainReferee,
          linesman1,
          linesman2,
        }
      );
      return res.status(201).json({ data: result });
    } catch (error) {
      console.error("Error creating match:", error);
      return res.status(400).json({ error: "Internal server error" });
    }
  } catch (error) {
    console.error("Error creating match:", error);
    return res.status(400).json({ error: "Internal server error" });
  }
};

// get reserved seats
module.exports.getReservedSeats = async (req, res) => {
  try {
    const matchID = req.params.id;
    // if env is dev
    if (process.env.NODE_ENV === "development") {
      console.log(req.body);
    }
    // get the user
    const match = await Match.findOne({
      _id: matchID,
    });
    // if the user is not found
    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    return res
      .status(200)
      .json({ message: "Successful get user", data: match.reservedSeats });
  } catch (error) {
    console.error("Error getting match:", error);

    return res.status(400).json({ error: "Internal server error" });
  }
};

//delete match
module.exports.deleteMatch = async (req, res) => {
  try {
    // get the role of the requeseter form the token
    const token = req.headers["authorization"];
    // if token is undefined
    if (!token) {
      return res.status(400).json({ message: "You are not logged in" });
    }
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    const role = decoded.role;
    // if env is dev
    if (process.env.NODE_ENV === "development") {
      console.log(req.body);
    }
    //check if the user is admin
    if (role !== "Manager") {
      return res.status(400).json({ message: "You are not an Manager" });
    }
    const id = req.params.id;
    const match = await Match.findById(id);
    if (!match) {
      return res.status(400).json({ message: "match not found" });
    }
    // delete the match
    const result = await Match.deleteOne({ _id: id });
    return res.status(201).json({ data: result });
  } catch (error) {
    console.error("Error creating match:", error);
    return res.status(400).json({ error: error });
  }
};