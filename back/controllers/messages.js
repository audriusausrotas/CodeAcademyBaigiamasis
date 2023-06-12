const userSchema = require("../schemas/userSchema");
const conversationSchema = require("../schemas/conversationSchema");
const response = require("../modules/response");
const io = require("../sockets/main");
const DB = require("../modules/socketDB");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  sendMessage: async (req, res) => {
    const { _id, to, message, cID } = req.body;

    //get user

    const sender = await userSchema.findOne({ _id });
    sender.password = "";

    // map users to get reseivers arr
    const receivers = [];

    for (let item of to) {
      const temp = await userSchema.findOne({ _id: item._id });
      receivers.push({
        _id: temp._id.toString(),
        username: temp.username,
        avatar: temp.avatar,
      });
    }

    //creating new message
    const newMessage = {
      _id: uuidv4(),
      from: { _id, username: sender.username, avatar: sender.avatar },
      to: receivers,
      message,
      likes: [],
      time: new Date().toLocaleTimeString(undefined, {
        hour12: false,
      }),
    };

    let data = {};

    if (cID) {
      // if conversation id exists, add message to it

      data = await conversationSchema.findOneAndUpdate(
        { _id: cID },
        { $push: { messages: newMessage } },
        { new: true }
      );
    } else {
      // if conversation id doesnt exist, check if conversation exist

      const allConversations = await conversationSchema.find({
        users: { $size: to.length + 1 },
      });

      const receiversId = receivers.map((item) => item._id);
      const userList = [_id, ...receiversId];

      const doesExist = allConversations.find((item) =>
        item.users.every((user) => userList.some((el) => user._id === el))
      );

      if (doesExist) {
        data = await conversationSchema.findOneAndUpdate(
          { _id: doesExist._id },
          { $push: { messages: newMessage } },
          { new: true }
        );
      } else {
        //create new conversation
        const newConversation = new conversationSchema({
          users: [
            {
              _id: sender._id.toString(),
              username: sender.username,
              avatar: sender.avatar,
            },
            receivers[0],
          ],
          messages: [newMessage],
          name: receivers[0].username,
        });

        // save new conversation
        data = await newConversation.save();
      }
    }

    // set notification to users and send
    for (let item of to) {
      const receiver = await userSchema.findOneAndUpdate(
        { _id: item._id },
        {
          $addToSet: {
            notifications: {
              _id: data._id.toString(),
              username: sender.username,
            },
          },
        },
        { new: true }
      );

      // send message to users
      const sendTo = DB.getUser(item._id);
      if (sendTo) {
        io.to(sendTo.socketID).emit("newMessage", { data, receiver });
      }
    }
    // send response
    return response(res, true, data, "Message Send");
  },
  /////////////////////////////////////////////////////

  getMessages: async (req, res) => {
    const { _id } = req.body;

    const conversations = await conversationSchema.find();

    const found = conversations.filter((item) =>
      item.users.some((user) => user._id.toString() === _id)
    );

    return response(res, true, found, "ok");
  },
  ///////////////////////////////////////////////////////////////////
  deleteConversation: async (req, res) => {
    const { _id, cID, users } = req.body;

    //delete conv by id
    const data = await conversationSchema.findOneAndDelete({ _id: cID });

    //delete notifications

    const sender = await userSchema.findOneAndUpdate(
      { _id: _id },
      { $pull: { notifications: { _id: cID } } },
      { new: true }
    );
    sender.password = "";

    if (data) {
      for (let item of users) {
        const receiver = await userSchema.findOneAndUpdate(
          { _id: item._id.toString() },
          { $pull: { notifications: { _id: cID } } },
          { new: true }
        );
        receiver.password = "";

        const sendTo = DB.getUser(item._id.toString());
        if (sendTo) {
          io.to(sendTo.socketID).emit("deleteConversation", {
            _id: cID,
            user: receiver,
          });
        }
      }

      return response(res, true, { data, user: sender }, "ok");
    } else {
      return response(res, false, null, "something went wrong");
    }
  },

  ///////////////////////////////////////////////////////////////////

  likeMessage: async (req, res) => {
    const { _id, cID, item } = req.body;

    const conversation = await conversationSchema.findOne({
      _id: cID,
    });

    const messages = [...conversation.messages];

    messages.forEach((el) => {
      if (el._id === item._id) {
        if (el.likes.includes(_id)) {
          el.likes = el.likes.filter((like) => like !== _id);
        } else {
          el.likes.push(_id);
        }
      }
    });

    const data = await conversationSchema.findOneAndUpdate(
      { _id: cID },
      { $set: { messages: messages } },
      { new: true }
    );

    if (data) {
      const temp = DB.getUser(item.from._id);
      if (temp) io.to(temp.socketID).emit("likeMessage", data);

      item.to.forEach((user) => {
        const temp = DB.getUser(user._id);
        if (temp) io.to(temp.socketID).emit("likeMessage", data);
      });
      return response(res, true, data, "like added");
    } else {
      return response(res, false, null, "something went wrong");
    }
  },

  ///////////////////////////////////////////////////////////////////
  inviteUser: async (req, res) => {
    const { cID, user } = req.body;

    const userExist = await userSchema.findOne({ _id: user._id });

    if (!userExist) return response(res, false, null, "user doesnt exist");

    const data = await conversationSchema.findOneAndUpdate(
      { _id: cID },
      { $addToSet: { users: user } },
      { new: true }
    );

    if (data) {
      const newData = { index: cID, user };

      data.users.forEach((user) => {
        const temp = DB.getUser(user._id.toString());
        if (temp) io.to(temp.socketID).emit("updateInvited", newData);
      });
      return response(res, true, null, "ok");
    } else {
      return response(res, false, null, "something went wrong");
    }
  },
};
