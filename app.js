const express = require('express');
const port = 9000;
const app = express();

// //parse the form data sent with post request
// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: false }));

// connect to the mysql DB
const sequelize = require('./util/database');
const User = require('./models/user')

// set the static folder in my express (by the we can use css and js file)
app.use(express.static('./public'));

// use express router
app.use('/', require('./router/user'));
app.use('/user', require('./router/user'));

sequelize.sync().then((result) => {
    app.listen(port, function (err) {
        if (err) {
            console.log(`Error in running the server: ${err}`);
        }
        console.log(`Server is running on port: ${port}`);
    });
}).catch((err) => {
    console.log(err);
});