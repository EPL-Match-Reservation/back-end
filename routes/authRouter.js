const express = require('express');

const userController = require('../controllers/userController');

const Router = express.Router();


Router.post('/signup', userController.validateSignUp, userController.createUser);
Router.post('/login', userController.loginUser);

module.exports = Router;



