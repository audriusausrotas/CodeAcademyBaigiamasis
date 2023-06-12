const userSchema = require("../schemas/userSchema");
const bcrypt = require("bcrypt");
const response = require("../modules/response");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const io = require("../sockets/main");

module.exports = {
  register: async (req, res) => {
    const { username, pass1, avatar } = req.body;

    const isUser = await userSchema.findOne({ username });

    if (isUser) {
      return response(res, false, null, "User already exists");
    }

    const user = new userSchema({
      username,
      password: await bcrypt.hash(pass1, +process.env.SALT),
      avatar: avatar ? avatar : undefined,
    });

    const data = await user.save();
    if (data) {
      data.password = "";
      io.emit("newUser", data);
      return response(res, true, null, "Registered");
    }
  },

  ///////////////////////////////////////////////////////////////////
  login: async (req, res) => {
    const { username, pass1 } = req.body;

    const data = await userSchema.findOne({ username });
    if (!data) {
      return response(res, false, null, "User not found");
    } else {
      if (await bcrypt.compare(pass1, data.password)) {
        const token = jwt.sign(
          { id: data._id, username: data.username },
          process.env.TOKEN_SECRET
        );
        data.password = "";
        return response(res, true, data, token);
      } else {
        return response(res, false, null, "wrong password");
      }
    }
  },

  ///////////////////////////////////////////////////////////////////
  autoLogin: async (req, res) => {
    const { username } = req.body;

    const data = await userSchema.findOne({ username });
    if (data) {
      data.password = "";

      return response(res, true, data, "Loged in");
    }
  },

  ///////////////////////////////////////////////////////////////////
  getUser: async (req, res) => {
    const { user } = req.body;
    const usr = await userSchema.findOne({ username: user });
    usr.password = "";
    return response(res, true, usr, "ok");
  },

  ///////////////////////////////////////////////////////////////////
  getUsers: async (req, res) => {
    const { _id } = req.body;

    const usr = await userSchema.find();

    const users = usr.filter((item) => {
      if (item._id.toString() !== _id) {
        item.password = "";
        return item;
      }
    });

    return response(res, true, users, "ok");
  },
};
