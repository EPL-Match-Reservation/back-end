const express = require("express");

const userController = require("../controllers/userController");

const Router = express.Router();

Router.get('/getreservations/',userController.getReservations);
Router.post('/reserve/:match_id',userController.reserve);
Router.post('/cancel/:match_id',userController.cancel);


module.exports = Router;