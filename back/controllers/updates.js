const userSchema = require("../schemas/userSchema");
const response = require("../modules/response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const io = require("../sockets/main");

module.exports = {
  updateAvatar: async (req, res) => {
    const { newValue, _id } = req.body;

    const newUser = await userSchema.findOneAndUpdate(
      { _id },
      {
        $set: { avatar: newValue },
      },
      { new: true }
    );

    newUser.password = "";

    io.emit("userUpdate", newUser);

    return response(res, true, { newUser }, "avatar updated");
  },

  ///////////////////////////////////////////////////////////////////
  updateUsername: async (req, res) => {
    const { newValue, _id } = req.body;

    const isUser = await userSchema.findOne({ username: newValue });

    if (isUser) {
      return response(res, false, null, "Username already exist");
    }

    const newUser = await userSchema.findOneAndUpdate(
      { _id },
      {
        $set: { username: newValue },
      },
      { new: true }
    );

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.TOKEN_SECRET
    );

    io.emit("userUpdate", newUser);

    return response(res, true, { newUser, token }, "username updated");
  },

  ///////////////////////////////////////////////////////////////////
  updatePassword: async (req, res) => {
    const { newValue, _id } = req.body;

    const newUser = await userSchema.findOneAndUpdate(
      { _id },
      {
        $set: { password: await bcrypt.hash(newValue, +process.env.SALT) },
      },
      { new: true }
    );

    newUser.password = "";

    return response(res, true, { newUser }, "password updated");
  },

  ///////////////////////////////////////////////////////////////////
  deleteNotification: async (req, res) => {
    const { _id, item } = req.body;
    const data = await userSchema.findOneAndUpdate(
      { _id },
      { $pull: { notifications: { _id: item } } },
      { new: true }
    );

    if (data) {
      return response(res, true, data, "notification added");
    } else {
      return response(res, false, null, "something went wrong");
    }
  },
};
