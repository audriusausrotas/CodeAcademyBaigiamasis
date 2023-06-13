const response = require("../modules/response");

module.exports = {
  password: async (req, res, next) => {
    const { newValue: pass1 } = req.body;
    req.body.pass1 = pass1;
    next();
  },
};
