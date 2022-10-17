require("dotenv").config();
const { Post } = require("./mongoose/models/Post");
const { createUid } = require("./util/createRandom");

const express = require("express");

const bodyParser = require("body-parser");

const app = express();

const recycleRouter = require("./routers/recycle");

const SERVER_PORT = process.env.SERVER_PORT;

const { mongoDb, initDb } = require("./mongoose");

const socketServer = require("./socket");

console.log("Socket : ");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use("/recycle", recycleRouter);

app.listen(SERVER_PORT, () => {
  console.log("Running Server");
});

initDb();

app.get("/user", async (req, res) => {
  const user = await Post.find({});
  res.send(user);
});
