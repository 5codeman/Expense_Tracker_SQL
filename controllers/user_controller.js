const User = require('../models/user');

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