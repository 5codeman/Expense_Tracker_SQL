const sequelize = require('sequelize');
const User = require('../models/user');
const Expense = require("../models/expense");
const Premium = require('../models/premium');
const ResetPassword = require("../models/resetPassword");
const path = require('path');
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay"); //payment gateway service
const Sib = require("sib-api-v3-sdk"); //sendinblue or brevo - emain sending service
const { v4: uuidv4 } = require("uuid"); // unique id generator

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
                const token = generateAccessToken(user.id, user.email);
                res.cookie("jwt_token", token); // , { maxAge: 1000, httpOnly: true } = for set the cookie expire time
                // res.status(200).send(`<script> window.location.href='/user_dashboard'; </script>`);
                // res.redirect('/user_dashboard');
                res.status(200).json({ redirect: '/user_dashboard' });

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

// here we use razorpay service for payment
module.exports.buyPremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        //amount should be written in paise
        rzp.orders.create({ amount: 49900, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            Premium.create({
                orderid: order.id,
                status: "PENDING",
                userId: req.user.id
            }).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id });
            }).catch((err) => {
                throw new Error(err);
            });

            // this code is same as upper for create in order table here req.user belong to a row create is a function of sequlize and premium is a table.
            // this below code is the easier way to write the same code as above

            // req.user
            //     .createPremium({ orderid: order.id, status: "PENDING" })
            //     .then(() => {
            //         return res.status(201).json({ order, key_id: rzp.key_id });
            //     })
            //     .catch((err) => {
            //         throw new Error(err);
            //     });
        });
    } catch (err) {
        res.status(403).json({ message: "Something went wrong", error: err });
    }
};

module.exports.updateTransactionStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        const premium = await Premium.findOne({ where: { orderid: order_id } });
        premium.update({
            paymentid: payment_id,
            status: "SUCCESSFUL",
        }).then(() => {
            return res.status(202).json({
                sucess: true,
                message: "Transaction Successful",
            });
        }).catch((error) => {
            throw new Error(error);
        });

        req.user.update({ isPremiumUser: true });

        //   Promise.all([promise1, promise2])
        //     .then(() => {
        //       return res.status(202).json({
        //         sucess: true,
        //         message: "Transaction Successful",
        //         // token: userController.generateAccessToken(userId, undefined, true),
        //       });
        //     })
        //     .catch((error) => {
        //       throw new Error(error);
        //     });
    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: "Sometghing went wrong" });
    }
};

module.exports.isPremiumUser = async (req, res) => {
    try {
        if (req.user.isPremiumUser) {
            return res.json({ isPremiumUser: true });
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports.getLeaderboardPage = async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../public/views/leaderboard.html'));
    } catch {
        (err) => console.log(err);
    }
};

module.exports.getLeaderboardUser = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users); // send the date where api call (This is is API or controller for get expense data)
    } catch (err) {
        console.log(err);
    }
    //pending task - we have to send the sorted data from here backend only
};

//send sorted data from backend - pending wqtch sir video

// exports.getLeaderboardUser = (req, res, next) => {
//   Expense.findAll({
//     attributes: [
//       [sequelize.fn("sum", sequelize.col("amount")), "totalExpense"],
//       [sequelize.col("user.name"), "name"],
//     ],
//     group: ["userId"],
//     include: [
//       {
//         model: User,
//         attributes: [],
//       },
//     ],
//     order: [[sequelize.fn("sum", sequelize.col("amount")), "DESC"]],
//   })
//     .then((expenses) => {
//       const result = expenses.map((expense) => ({
//         name: expense.getDataValue("name"),
//         amount: expense.getDataValue("totalExpense"),
//       }));
//       res.send(JSON.stringify(result));
//     })
//     .catch((err) => console.log(err));
// };

module.exports.getReportsPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/reports.html'));
};

module.exports.dailyReports = async (req, res) => {
    try {
        const date = req.body.date;
        const expenses = await Expense.findAll({
            where: { date: date, userId: req.user.id }
        });
        return res.send(expenses);
    } catch (error) {
        console.log(error);
    }
};

module.exports.monthlyReports = async (req, res) => {
    try {
        const month = req.body.month;
        const expenses = await Expense.findAll({
            where: { date: { [sequelize.Op.like]: `%-${month}-%`, }, userId: req.user.id, } //, raw: true,
        });
        return res.send(expenses);
    } catch (error) {
        console.log(error);
    }
};

// Forget Password implemented here

module.exports.forgotPasswordPage = async (req, res) => {
    try {
        res.status(200).sendFile(path.join(__dirname, "../public/views/forgotPassword.html"));
    } catch (error) {
        console.log(error);
    }
};

module.exports.sendMail = async (req, res) => {
    try {
        const email = req.body.email;
        const requestId = uuidv4(); //generate the unique id from uuid

        const recepientEmail = await User.findOne({ where: { email: email } });

        if (!recepientEmail) {
            return res.status(404).json({ message: "Please provide the registered email!" });
        }

        await ResetPassword.create({
            id: requestId,
            isActive: true, // mail link is active
            userId: recepientEmail.dataValues.id // Foriegn Key
        });

        //Here we use Brevo or sendinblue service for email
        const client = Sib.ApiClient.instance; // it gets instance object from brevo or alias as SendInBlue(sib)
        const apiKey = client.authentications["api-key"]; // it get the api-key object
        apiKey.apiKey = process.env.BREVO_API_KEY; // we set a property name as apikey under the api-key object
        const transEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email: "chiragraj106@gmail.com",
            name: "Chirag Raj",
        };
        const receivers = [{ email: email }];
        await transEmailApi.sendTransacEmail({
            sender,
            To: receivers,
            subject: "Expense Tracker Reset Password",

            // textContent: "Link Below", (no need of text content because html content overide on textcontent)

            htmlContent: `<h3> Hii! We got the request from you for reset the password. Here is the link below >>> </h3>
            <a href="http://localhost:9000/resetPasswordPage/{{params.requestId}}"> Reset your Password from here </a>`,
            params: {
                requestId: requestId,
            },
        });
        return res.status(200).json({
            message:
                "Link for reset the password is successfully send on your Mail Id!",
        });
    } catch (error) {
        console.log("error");
        return res.status(409).json({ message: "failed changing password" });
    }
};

module.exports.resetPasswordPage = async (req, res, next) => {
    try {
        res.status(200).sendFile(path.join(__dirname, "../public/views/resetPassword.html"));
    } catch (error) {
        console.log(error);
    }
    // here we can acess req.params and req.url
};

module.exports.resetPassword = async (req, res, next) => {
    try {
        const password = req.body.password;
        const requestId = req.headers.referer.split("/"); //req.headers.referer - it provide the address or url of the just previous web page.
        //req.url  - this gives same as req.headers.referer but of the current reuest, and we cannot use this because of the request is chnage, see carefullly this is diifrent route
        //req.params - see carefullly this is diifrent route, we cannot find params from this reset password controller beacuse request is change after clicking reset paasword button means rout and controller change and req object is also change
        // see just abouve controller name as module.exports.resetPasswordPage there we can acess req.url and req.parms

        const checkResetRequest = await ResetPassword.findAll({
            where: { id: requestId[requestId.length - 1], isActive: true },
        });

        if (checkResetRequest[0]) {
            await ResetPassword.update(
                { isActive: false },
                { where: { id: requestId[requestId.length - 1] } }
            );
            const userId = checkResetRequest[0].dataValues.userId;
            await User.update(
                { password: password },
                { where: { id: userId } }
            );
            return res.status(200).json({ message: "Successfully changed password!" });
        }
        else {
            return res.status(409).json({ message: "Link is already Used Once, Request for new Link!" });
        }
    } catch (err) {
        console.log(err);
        return res.status(409).json({ message: "Failed to change password!" });
    }
};
