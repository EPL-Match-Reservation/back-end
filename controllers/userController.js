const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const Match = require("../models/matchModel");
const Ticket = require("../models/ticketModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const {
  validateDOB,
  validateEmail,
  validatefirstName,
  validatelastName,
  validateUsername,
  validatePassword,
} = require("../controllers/validate");

// validation for sign up
exports.validateSignUp = [
  validateDOB,
  validateEmail,
  validatefirstName,
  validatelastName,
  validateUsername,
  validatePassword,
  (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "error",
          message: "Error in signUP",
        });
      }
      next();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
];

// create user
exports.createUser = async (req, res) => {
  try {
    const {
      username,
      password,
      firstName,
      lastName,
      birthdate,
      gender,
      city,
      address,
      email,
      role,
    } = req.body;
    // if env is dev
    if (process.env.NODE_ENV === "development") {
      console.log(req.body)
    }
    //check if the user already exists
    var user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = new User({
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
      birthdate: birthdate,
      gender: gender,
      city: city,
      address: address,
      email: email,
      role: role,
    });
    //hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    // create a token
    const token = user.generateJWT();
    console.log("token: " + token);
    //save the user
    await user.save();
    return res
      .status(201)
      .header("x-auth-token", token)
      .send({
        message: "Successful User signUp",
        data: { userId: user._id, role: user.role },
        "x-auth-token": token,
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// login user
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // if env is dev
    if (process.env.NODE_ENV === "development") {
      console.log(req.body)
    }
    //check if the user already exists
    let user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    //check if the password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(203).json({ message: "Invalid email or password" });
    }
    //if user is a manager and not approved
    if (!user.approved) {
      return res.status(203).json({ message: "USER not approved" });
    }
    // create a token
    const token = user.generateJWT();
    console.log("token: " + token);
    return res
      .status(200)
      .header("x-auth-token", token)
      .send({
        message: "Successful User login",
        data: { userId: user._id, role: user.role },
        "x-auth-token": token,
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get all users
exports.getAllUsers = async (req, res) => {
  try {
    // get all approved users
    const users = await User.find({ approved: true });
    res.status(200).json({ message: "Successful get all users", data: users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// check username



/////////////////////////////////////////////////////////////////////



exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined -haha",
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined -haha",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined -haha",
  });
};
