const Team = require("../models/teamModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const addTeam = async (req, res) => {
  try {
    // get the role of the requeseter form the token
    const token = req.headers["authorization"];
    // if token is undefined
    if (!token) {
      return res.status(400).json({ message: "You are not logged in" });
    }
    console.log(token.split(" ")[1]);
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
    const { name, photo } = req.body;
    var team = await Team.find({ name: name });
    console.log(team);
    if (team.length > 0) {
      return res.status(400).json({ message: "Team already exists" });
    }

    team = new Team({
      name: name,
      photo: photo,
    });
    await team.save();
    res.status(201).json({ message: "Team added successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json({ data: teams });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// get team by name
const getTeamByName = async (req, res) => {
  try {
    const team = await Team.find({ name: req.body.name });
    res.status(200).json({ data: team });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    res.status(200).json({ data: team });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// update
const updateTeam = async (req, res) => {
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
    const { name, photo } = req.body;
    var team = await Team.findById(req.params.id);
    if (team == null) {
      return res.status(400).json({ message: "Team does not exist" });
    }
    team.name = name;
    team.photo = photo;
    await team.save();
    res.status(200).json({ message: "Team updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//delete
const deleteTeam = async (req, res) => {
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
    const team = await Team.findById(req.params.id);
    if (team == null) {
      return res.status(400).json({ message: "Team does not exist" });
    }
    // delete
    // await team.remove();
    await Team.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.addTeam = addTeam;
exports.getTeams = getTeams;
exports.getTeam = getTeam;
exports.getTeamByName = getTeamByName;
exports.updateTeam = updateTeam;
exports.deleteTeam = deleteTeam;
