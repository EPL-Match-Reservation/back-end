const express = require("express");

const userController = require("../controllers/userController");

const Router = express.Router();

Router.route("/").get(userController.getAllUsers);

Router.route("/user").get(userController.getUserData);

Router.route("/nonapproved").get(userController.getAllNonApprovedUsers);

Router.route("/checkusername").post(userController.checkUsername);

Router.route("/approve/:id").patch(userController.approveUser);

// update user to manager
Router.route("/updatetomanager/:id").patch(userController.updateUserToManager);

Router.route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = Router;
