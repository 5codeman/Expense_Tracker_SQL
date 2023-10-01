const express = require('express');
const router = express.Router();

//here userAuthentication is a middleware function
const userAuthentication = require("../middleware/auth");

const homeController = require('../controllers/home_controller');

const userController = require('../controllers/user_controller');

router.get('/', homeController.homePage);

router.post('/signUp', userController.signUp);

router.post('/signIn', userController.signIn);

router.get('/user_dashboard', userAuthentication, userController.userDashboard);

module.exports = router;