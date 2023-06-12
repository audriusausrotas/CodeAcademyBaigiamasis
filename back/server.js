const express = require("express");
const server = express();
const cors = require("cors");
const mainRouter = require("./router/mainRouter");
const mongoose = require("mongoose");
require("dotenv").config();
require("./sockets/main");

server.use(cors());
server.use(express.json());

mongoose
  .connect(process.env.MONGO_CONNECT)
  .then(() => console.log("connect success"))
  .catch((e) => console.log(e));

server.use("/", mainRouter);
server.listen(4100);
