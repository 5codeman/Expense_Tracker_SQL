const jwt = require("jsonwebtoken");

const secure = (req, res, next) => {
    try {
        // If user is already signed_in so, we want they not open the sign in page and supose they sign in page by any chance then he cant login again
        const token = req.cookies.jwt_token;
        if (token) {
            const user = jwt.verify(token, process.env.SECRET_KEY);
            if (user) {
                res.redirect('/user_dashboard');
            }
            // if token is not verified then it goes to catch block
        }
        next();
    } catch (err) {
        // console.log(err);
        // return res.status(401).json({ success: false });
        res.send(`<script> document.cookie = "jwt_token=; max-age=-60"; window.location.href='/';</script>`);
    }
};

module.exports = secure;