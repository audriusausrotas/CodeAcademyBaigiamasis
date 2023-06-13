const response = require("../modules/response");

const SYMBOLS = ["(", "!", "@", "#", "$", "%", "^", "&", "*", "_", "+", ")"];

module.exports = {
  checkAll: async (req, res, next) => {
    const { username, pass1, pass2 } = req.body;

    if (username) {
      const userOk = checkLength(username, "Username");
      if (userOk !== "ok") {
        return response(res, false, null, userOk);
      }
    }
    if (pass2 && pass1 !== pass2) {
      return response(res, false, null, "Passwords doesn't match");
    }

    if (pass1) {
      const passOk = checkLength(pass1, "Password");
      if (passOk !== "ok") {
        return response(res, false, null, passOk);
      }
      console.log(pass1);
      if (checkPasswordSymbols(pass1)) {
      } else {
        return response(res, false, null, "Add special symbol");
      }
    }
    next();
  },
};

function checkLength(string, type) {
  if (string.length < 4) {
    return `${type} too short`;
  } else if (string.length > 20) {
    return `${type} too long`;
  } else {
    return "ok";
  }
}

function checkPasswordSymbols(password) {
  return SYMBOLS.some((item) => password.includes(item));
}
