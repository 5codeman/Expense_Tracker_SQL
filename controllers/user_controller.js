const sequelize = require('sequelize');
const User = require('../models/user');
const path = require('path');
const jwt = require("jsonwebtoken");

module.exports.signUp = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        await User.findOne({ where: { email: email } }).then((user) => {
            if (user) {
                res.status(409).send(`<script>alert('This email is already taken. Please choose another one.'); window.location.href='/';</script>`);
            }
            else {
                User.create({
                    name: name,
                    email: email,
                    password: password
                });
                res.send(`<script>alert('User Created Successfully!'); window.location.href='/';</script>`);
            }
        }).catch((err) => console.log(err));
    }

    catch (error) {
        console.log(error);
    }
};

// for genereating JWT token
function generateAccessToken(id, email) {
    return jwt.sign({ userId: id, email: email }, process.env.SECRET_KEY);
};

module.exports.signIn = async function (req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        await User.findOne({ where: { email: email } }).then((user) => {
            if (!user) {
                res.status(404).send(`<script> window.location.href='/'; alert('User not found!'); </script>`);
            }

            else if (user && user.password != password) {
                res.status(401).send(`<script> window.location.href='/'; alert('Password Incorrect!'); </script>`);
            }

            else if (user && user.password == password) {
                res.status(200).send(`<script> window.location.href='/user_dashboard'; </script>`);

            }
        }).catch((err) => {
            console.log(err);
        });
    }
    catch (err) {
        console.log(err);
    }
};

module.exports.userDashboard = function (req, res) {
    res.sendFile(path.join(__dirname, '../public/views/user_dashboard.html'));
};