const response = require("../modules/response");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const token = req.headers["authorization"];

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) return response(res, false, null, "Auth error");
    req.body.username = user.username;
    req.body._id = user.id;
    return next();
  });
};
