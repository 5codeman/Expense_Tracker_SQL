const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expense_controller');

router.post('/addExpense', expenseController.addExpense);

module.exports = router;