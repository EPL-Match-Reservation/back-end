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
          ErrorMessage: errors,
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
    } = req.body;
    // if env is dev
    if (process.env.NODE_ENV === "development") {
      console.log(req.body);
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
    });
    // set user role to fan
    user.role = "Fan";
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
    return  res.status(400).json({ message: error.message });
  }
};

// login user
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // if env is dev
    if (process.env.NODE_ENV === "development") {
      console.log(req.body);
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
    return  res.status(400).json({ message: error.message });
  }
};

// get all users (Approved) if is admin
exports.getAllUsers = async (req, res) => {
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
    if (role !== "Admin") {
      return res.status(400).json({ message: "You are not an Admin" });
    }
    // get all users
    const users = await User.find({ approved: true });
    // drop password field
    users.forEach((user) => {
      user.password = undefined;
    });
    return  res.status(200).json({ message: "Successful get all users", data: users });
  } catch (error) {
    return  res.status(400).json({ message: error.message });
  }
};

// get all non approved users if is admin
exports.getAllNonApprovedUsers = async (req, res) => {
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
    if (role !== "Admin") {
      return res.status(400).json({ message: "You are not an Admin" });
    }
    // get all non approved users
    const users = await User.find({ approved: false });
    // drop password field
    users.forEach((user) => {
      user.password = undefined;
    });
    return  res
      .status(200)
      .json({ message: "Successful get all non approved users", data: users });
  } catch (error) {
    return  res.status(400).json({ message: error.message });
  }
};

// check username
exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.body;
    // if env is dev
    if (process.env.NODE_ENV === "development") {
      console.log(req.body);
    }
    //check if the user already exists
    const user = await User.findOne({ username: username });
    if (!user) {
      return res
        .status(400)
        .json({ bool: "false", message: "User Name does not exist" });
    }
    return  res.status(200).json({ bool: "true", message: "User Name exists" });
  } catch (error) {
    return  res.status(400).json({ message: error.message });
  }
};

// deleteuser make sure it is an admin
exports.deleteUser = async (req, res) => {
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
    if (role !== "Admin") {
      return res.status(400).json({ message: "You are not an Admin" });
    }
    //get the requested user from the request param
    const username = req.params.id;
    // if env is dev
    if (process.env.NODE_ENV === "development") {
      console.log(req.body);
    }
    //check if the user already exists
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    //delete the user
    await User.deleteOne({ username: username });
    return  res.status(200).json({ message: "Successful delete user" });
  } catch (error) {
    return  res.status(400).json({ message: error.message });
  }
};

// approve user if the one calling the requset is Admin and the user he want to approve is existing
exports.approveUser = async (req, res) => {
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
    if (role !== "Admin") {
      return res.status(400).json({ message: "You are not an Admin" });
    }
    //get the requested user from the request param
    const username = req.params.id;
    // if env is dev
    if (process.env.NODE_ENV === "development") {
      console.log(req.body);
    }
    //check if the user already exists
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    //check if the user is already approved
    if (user.approved) {
      return res.status(400).json({ message: "User is already approved" });
    }
    //approve the user
    await User.updateOne({ username: username }, { approved: true });
    return  res.status(200).json({ message: "Successful approve user" });
  } catch (error) {
    return  res.status(400).json({ message: error.message });
  }
};

// update user to be manager
exports.updateUserToManager = async (req, res) => {
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
    if (role !== "Admin") {
      return res.status(400).json({ message: "You are not an Admin" });
    }
    //get the requested user from the request body
    const username = req.params.id;
    // if env is dev
    if (process.env.NODE_ENV === "development") {
      console.log(req.body);
    }
    //check if the user already exists
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    //check if the user is already a manager
    if (user.role === "Manager") {
      return res.status(400).json({ message: "User is already a manager" });
    }
    //update the user to be a manager
    await User.updateOne({ username: username }, { role: "Manager" });
    return  res.status(200).json({ message: "Successful update user to be a manager" });
  } catch (error) {
    return  res.status(400).json({ message: error.message });
  }
};

// update user it should be his  own data
exports.updateUser = async (req, res) => {
  try {
    // get the role of the requeseter form the token
    const token = req.headers["authorization"];
    // if token is undefined
    if (!token) {
      return res.status(400).json({ message: "You are not logged in" });
    }
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    //get the requested user from the request params
    const username = req.params.id;
    // if env is dev
    if (process.env.NODE_ENV === "development") {
      console.log(req.body);
    }
    //check if the user already exists
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    //check if the user is the one who is calling the request
    console.log(decoded.role);
    if (username !== decoded.username && decoded.role !== "Admin") {
      return res.status(400).json({ message: "You are not the user" });
    }
    //update the user
    // if password changed hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    await User.updateOne({ username: username }, req.body);
    return  res.status(200).json({ message: "Successful update user" });
  } catch (error) {
    return  res.status(400).json({ message: error.message });
  }
};

// get user by username if admin and username in param
exports.getUser = async (req, res) => {
  try {
    // get the role of the requeseter form the token
    const token = req.headers["authorization"];
    // if token is undefined
    if (!token) {
      return res.status(400).json({ message: "You are not logged in" });
    }
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
    const role = decoded.role;
    const username = req.params.id;
    // if env is dev
    if (process.env.NODE_ENV === "development") {
      console.log(req.body);
    }
    //check if the user is admin
    if (role !== "Admin") {
      return res.status(400).json({ message: "You are not an Admin" });
    }
    //check if the user already exists
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    // drop password field
    user.password = undefined;
    return  res.status(200).json({ message: "Successful get user", data: user });
  } catch (error) {
    return  res.status(400).json({ message: error.message });
  }
};
