const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = (req, res, next) => {
    try {
        const token = req.cookies.jwt_token;
        //suppose if token not exist in browser cookies or someone delete it
        if (!token) {
            res.redirect('/');
        }

        // in this user a object is return with email and the userId
        const user = jwt.verify(token, process.env.SECRET_KEY); //It give the binded data after matching with secret_key

        //suppose someone edit or alter my token in browser cokkies or cookies is not match with my secret key or vrify unsuccessful.
        if (!user) {
            res.redirect('/');
        }

        User.findByPk(user.userId).then((user) => {
            //suposse that if user is not in our db or not exist
            if (!user) {
                res.redirect('/');
            }
            req.user = user; //make a user property in req
            next(); // it goes to next action, controller
        });
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false });
    }
};

module.exports = authenticate;