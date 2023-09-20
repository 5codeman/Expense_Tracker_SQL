const path = require('path');

module.exports.homePage = function (req, res) {
    res.sendFile(path.join(__dirname, '../public/views/sign_up.html'));
}

