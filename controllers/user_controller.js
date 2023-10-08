const sequelize = require('sequelize');
const User = require('../models/user');
const Expense = require("../models/expense");
const Premium = require('../models/premium');
const path = require('path');
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");

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
            where: { date: date, userId: req.user.id },
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
            where: {
                date: {
                    [sequelize.like]: `%-${month}-%`,
                },
                userId: req.user.id,
            },
            raw: true,
        });

        return res.send(expenses);
    } catch (error) {
        console.log(error);
    }
};