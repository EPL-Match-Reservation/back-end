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
    });
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
    const newMatch = await match.save();
    return res.status(201).json({ data: newMatch });
  } catch (error) {
    console.error("Error creating match:", error);

    return res.status(400).json({ error: "Internal server error" });
  }
};

module.exports.updateMatch = async (req, res) => {
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
  var {
    HomeTeam,
    AwayTeam,
    stadium,
    MatchDate,
    MatchTime,
    linesman1,
    linesman2,
    MainReferee,
  } = match;
  if (!match) {
    return res.status(400).json({ message: "match not found" });
  }
  //check if not null or ""
  if (req.body.HomeTeam != null && req.body.HomeTeam != "") {
    HomeTeam = req.body.HomeTeam;
  } else {
    HomeTeam = HomeTeam;
  }
  if (req.body.AwayTeam != null && req.body.AwayTeam != "") {
    AwayTeam = req.body.AwayTeam;
  } else {
    AwayTeam = AwayTeam;
  }
  if (req.body.MatchDate != null && req.body.MatchDate != "") {
    MatchDate = req.body.MatchDate;
  } else {
    MatchDate = MatchDate;
  }
  if (req.body.MatchTime != null && req.body.MatchTime != "") {
    MatchTime = req.body.MatchTime;
  } else {
    MatchTime = MatchTime;
  }
  if (req.body.linesman1 != null && req.body.linesman1 != "") {
    linesman1 = req.body.linesman1;
  } else {
    linesman1 = linesman1;
  }
  if (req.body.linesman2 != null && req.body.linesman2 != "") {
    linesman2 = req.body.linesman2;
  } else {
    linesman2 = linesman2;
  }
  if (req.body.MainReferee != null && req.body.MainReferee != "") {
    MainReferee = req.body.MainReferee;
  } else {
    MainReferee = MainReferee;
  }
  if (req.body.stadium != null && req.body.stadium != "") {
    const dbstadium = await Stadium.findOne({ name: req.body.stadium }).select({
      _id: 1,
    });
    if (!dbstadium) {
      return res.status(400).json({ message: "stadium not found" });
    }
    stadium = dbstadium._id;
    //check if staduium is available on the same MatchDate
    const match1 = await Match.findOne({
      stadium: dbstadium._id,
      MatchDate: MatchDate,
      MatchTime: MatchTime,
    });
    if (match1) {
      if (match1._id != id) {
        return res.status(400).json({ message: "stadium is not available" });
      }
    }
  } else {
    stadium = stadium;
  }
  //HomeTeam and AwayTeam can't be the same
  if (HomeTeam == AwayTeam) {
    return res
      .status(400)
      .json({ message: "HomeTeam and AwayTeam can not be the same" });
  }
  //check if HomeTeam or AwayTeam have match on the same MatchDate except the match that we want to edit
  if (req.body.HomeTeam != null || req.body.AwayTeam != null) {
    //check if HomeTeam or AwayTeam have match on the same MatchDate except the match that we want to edit
    const match2 = await Match.findOne({
      $or: [
        { HomeTeam: HomeTeam, MatchDate: MatchDate },
        { AwayTeam: AwayTeam, MatchDate: MatchDate },
      ],
    }).select({ _id: 1 });
    if (match2) {
      if (match2._id != id) {
        return res.status(400).json({
          message: "HomeTeam or AwayTeam have match on the same MatchDate",
        });
      }
    }
  }
  if (req.body.MatchDate != null || req.body.MatchTime != null) {
    //check if staduium is available on the same MatchDate
    const match3 = await Match.findOne({
      stadium: stadium,
      MatchDate: MatchDate,
      MatchTime: MatchTime,
    }).select({ _id: 1 });
    if (match3) {
      if (match3._id != id) {
        return res.status(400).json({ message: "stadium is not available" });
      }
    }
  }

  try {
    //if all null or "" return the same match
    if (
      HomeTeam == match.HomeTeam &&
      AwayTeam == match.AwayTeam &&
      stadium == match.stadium &&
      MatchDate == match.MatchDate &&
      MatchTime == match.MatchTime &&
      linesman1 == match.linesman1 &&
      linesman2 == match.linesman2 &&
      MainReferee == match.MainReferee
    ) {
      return res.status(400).json({ message: "Nothing is changed" });
    }
    const updatedMatch = await Match.updateOne(
      { _id: id },
      {
        $set: {
          HomeTeam: HomeTeam,
          AwayTeam: AwayTeam,
          stadium: stadium._id,
          MatchDate: MatchDate,
          MatchTime: MatchTime,
          linesman1: linesman1,
          linesman2: linesman2,
          MainReferee: MainReferee,
        },
      }
    );
    if (updatedMatch.modifiedCount == 1) {
      res.status(200).json({ message: "match updated" });
    } else {
      res.status(400).json({ message: "match not updated" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
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

module.exports.editMatch = async (req, res) => {
  try {
    const { matchId } = req.params;
    const match = await this.MatchService.editMatch(matchId);

    if (!match) {
      return res.status(400).json({ message: "Match not found" });
    }

    // Update fields if provided in the request body
    match.HomeTeam = req.body.HomeTeam || match.HomeTeam;
    match.AwayTeam = req.body.AwayTeam || match.AwayTeam;
    match.MatchVenue = req.body.MatchVenue || match.MatchVenue;
    match.MatchDate = req.body.MatchDate || match.MatchDate;
    match.MatchTime = req.body.MatchTime || match.MatchTime;
    match.linesman1 = req.body.linesman1 || match.linesman1;
    match.linesman2 = req.body.linesman2 || match.linesman2;
    match.MainReferee = req.body.MainReferee || match.MainReferee;

    // Save the updated match
    const updatedMatch = await match.save();

    res.status(200).json({ message: "Match updated", updatedMatch });
  } catch (error) {
    console.error("Error updating match:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
