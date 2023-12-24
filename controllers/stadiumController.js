const Stadium = require("../models/stadiumModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const addStadium = async (req, res) => {
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
    const { name, rows, columns } = req.body;
    var stadium = await Stadium.find({ name: name });
    console.log(stadium);
    if (stadium.length > 0) {
      return res.status(400).json({ message: "Stadium already exists" });
    }
    //rows can't be less than or equal to 0
    //rows can't be null
    if (rows <= 0 || rows == null || rows == "") {
      return res
        .status(400)
        .json({ message: "rows can not be less than or equal to 0 or Null" });
    }

    //columns can't be less than or equal to 0
    //columns can't be null
    if (columns <= 0 || columns == null || columns == "") {
      return res.status(400).json({
        message: "columns can not be less than or equal to 0 or Null",
      });
    }
    stadium = new Stadium({
      name: name,
      rows: rows,
      columns: columns,
    });
    await stadium.save();
    res.status(201).json({ message: "Stadium added successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getStadiums = async (req, res) => {
  try {
    const stadiums = await Stadium.find();
    res.status(200).json(stadiums);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// get stadium by name
const getStadiumByName = async (req, res) => {
  try {
    const stadium = await Stadium.find({ name: req.body.name });
    res.status(200).json(stadium);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getStadium = async (req, res) => {
  try {
    const stadium = await Stadium.findById(req.params.id);
    res.status(200).json(stadium);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// update
const updateStadium = async (req, res) => {
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
    const { name, rows, columns } = req.body;
    var stadium = await Stadium.findById(req.params.id);
    if (stadium == null) {
      return res.status(400).json({ message: "Stadium does not exist" });
    }
    //rows can't be less than or equal to 0
    //rows can't be null
    if (rows <= 0 || rows == null || rows == "") {
      rows = stadium.rows;
    }

    //columns can't be less than or equal to 0
    //columns can't be null
    if (columns <= 0 || columns == null || columns == "") {
      columns = stadium.columns;
    }
    stadium.name = name;
    stadium.rows = rows;
    stadium.columns = columns;
    await stadium.save();
    res.status(200).json({ message: "Stadium updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//delete
const deleteStadium = async (req, res) => {
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
    const stadium = await Stadium.findById(req.params.id);
    if (stadium == null) {
      return res.status(400).json({ message: "Stadium does not exist" });
    }
    // delete
    // await stadium.remove();
    await Stadium.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Stadium deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.addStadium = addStadium;
exports.getStadiums = getStadiums;
exports.getStadium = getStadium;
exports.getStadiumByName = getStadiumByName;
exports.updateStadium = updateStadium;
exports.deleteStadium = deleteStadium;
