const express = require('express');
const router = express.Router();

//here userAuthentication is a middleware function
const userAuthentication = require("../middleware/auth");

const expenseController = require('../controllers/expense_controller');

router.post('/addExpense', userAuthentication, expenseController.addExpense);

//its a normal route for get the data
router.get('/getAllExpenses', userAuthentication, expenseController.getAllExpenses);

//this route work with pagenation
router.get('/getAllExpenses/:page', userAuthentication, expenseController.getAllExpensesforPagination);

router.get('/deleteExpense/:id', userAuthentication, expenseController.deleteExpense);

router.post('/updateExpense/:id', userAuthentication, expenseController.updateExpense);

module.exports = router;