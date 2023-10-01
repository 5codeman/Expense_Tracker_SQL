const express = require('express');
const router = express.Router();

//here userAuthentication and secure is a middleware function
const userAuthentication = require("../middleware/auth");
const secure = require("../middleware/secure");

const homeController = require('../controllers/home_controller');

const userController = require('../controllers/user_controller');

router.get('/', secure, homeController.homePage);

router.post('/signUp', userController.signUp); // secure - we have to use this but for this time leave it

router.post('/signIn', secure, userController.signIn);

router.get('/user_dashboard', userAuthentication, userController.userDashboard);

module.exports = router;