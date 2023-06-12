const response = require("../modules/response");

module.exports = {
  username: async (req, res, next) => {
    const { newValue: username } = req.body;
    req.body.username = username;
    next();
  },
  password: async (req, res, next) => {
    const { newValue: pass1 } = req.body;
    req.body.pass1 = pass1;
    next();
  },
};
