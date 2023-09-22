const Expense = require("../models/expense");
// const User = require("../models/user");
const sequelize = require("../util/database");

module.exports.addExpense = async (req, res) => {
    // const t = await sequelize.transaction();
    try {
        const date = req.body.date;
        const category = req.body.category;
        const description = req.body.description;
        const amount = req.body.amount;

        // await User.update({ totalExpenses: req.user.totalExpenses + Number(amount), },
        //     { where: { id: req.user.id } },
        //     { transaction: t }
        // );

        // await 

        // console.log(amount);
        // console.log(req.body);

        Expense.create({
            date: date,
            category: category,
            description: description,
            amount: amount
            // userId: req.user.id
        }
            // ,{ transaction: t }
        ).then((data) => {
            res.status(200).redirect("/user_dashboard"); // Pending -: Doubt why use .redirect here, bcz when we give home route ('/) its not work
        }).catch((err) => {
            console.log(err);
        });
        // await t.commit();
    } catch {
        async (err) => {
            // await t.rollback();
            console.log(err);
        };
    }
};
