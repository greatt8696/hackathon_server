require("dotenv").config();
const { createUid } = require("./util/createRandom");

const express = require("express");

const bodyParser = require("body-parser");

const app = express();

const recycleRouter = require("./routers/recycle");

const SERVER_PORT = process.env.SERVER_PORT;

const { connectDb, initDb } = require("./mongoose");

const socketServer = require("./socket");

console.log("Socket init ");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use("/recycle", recycleRouter);

app.listen(SERVER_PORT, () => {
  console.log("Running Server");
});

connectDb().then(() => {
  initDb();
});
app.get("/user", async (req, res) => {
  const user = await Post.find({});
  res.send(user);
});
