const express = require('express');
const port = 9000;
const app = express();

// //parse the form data sent with post request
// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: false }));

// use express router
app.use('/', require('./router/user'));
app.use('/user', require('./router/user'));

app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});