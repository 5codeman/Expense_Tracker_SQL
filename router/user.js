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

router.get('/premiumMembership', userAuthentication, userController.buyPremium);

router.post('/updateTransactionStatus', userAuthentication, userController.updateTransactionStatus);

router.get('/isPremiumUser', userAuthentication, userController.isPremiumUser);

router.get('/getReportsPage', userAuthentication, userController.getReportsPage);

router.get('/getLeaderboardPage', userAuthentication, userController.getLeaderboardPage);

router.get('/getLeaderboardUser', userAuthentication, userController.getLeaderboardUser);

router.post('/dailyReports', userAuthentication, userController.dailyReports);

router.post('/monthlyReports', userAuthentication, userController.monthlyReports);

router.get("/forgotPasswordPage", userController.forgotPasswordPage);

router.post("/sendMail", userController.sendMail);

router.get("/resetPasswordPage/:requestId", userController.resetPasswordPage);

router.post("/resetPassword", userController.resetPassword);

module.exports = router;