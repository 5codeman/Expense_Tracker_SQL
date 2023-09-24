const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expense_controller');

router.post('/addExpense', expenseController.addExpense);

router.get('/getAllExpenses', expenseController.getAllExpenses);

router.get('/deleteExpense/:id', expenseController.deleteExpense);

router.post('/updateExpense/:id', expenseController.updateExpense);

module.exports = router;