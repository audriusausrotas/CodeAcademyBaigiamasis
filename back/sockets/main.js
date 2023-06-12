const { Server } = require("socket.io");
const DB = require("../modules/socketDB");
const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("userID", (data) => {
    DB.saveNewUser({ userID: data, socketID: socket.id });
  });

  socket.on("disconnect", () => {
    DB.deleteUser(socket.id);
  });
});

io.listen(4000);

module.exports = io;
