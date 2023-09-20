const Sequelize = require("sequelize");
const sequelize = new Sequelize('expense_web-app_sql', 'root', 'Sql@2022',
    {
        dialect: "mysql",
        host: "localhost"
    }
);

module.exports = sequelize;
