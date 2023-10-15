const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const PORT = process.env.PORT || 9000;
const app = express();

//parse the form data sent with post request
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json()); // It parses only json object(when any request post json data)

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// connect to the mysql DB
const sequelize = require('./util/database');
const User = require('./models/user');  // ? What is use of this
const Expense = require('./models/expense'); // ? What is use of this
const Premium = require('./models/premium');
const ResetPassword = require("./models/resetPassword");

// set the static folder in my express (by the we can use css and js file)
app.use(express.static('./public'));

// use express router
app.use('/', require('./router/user'));
app.use('/user', require('./router/user'));
app.use('/expense', require('./router/expense'));

//By this a foreign key is added in expense table which is a primary key of user table
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Premium);
Premium.belongsTo(User);

User.hasMany(ResetPassword);
ResetPassword.belongsTo(User);

//{ force: true } - it is writen in sync(), when we want to crate the fresh tabel or update the table or table schema
sequelize.sync().then((result) => { // ? How this .sync find the all module for creating table
    app.listen(PORT, function (err) {
        if (err) {
            console.log(`Error in running the server: ${err}`);
        }
        console.log(`Server is running on port: ${PORT}`);
    });
}).catch((err) => {
    console.log(err);
});