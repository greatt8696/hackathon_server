require("dotenv").config();
const { Post } = require("./mongoose/models/Post");
const { createUid } = require("./util/createRandom");

const express = require("express");

const bodyParser = require("body-parser");

const app = express();

const recycleRouter = require("./routers/recycle");

const PORT = "3600";

const { mongoDb, initDb } = require("./mongoose/dbManager");

const { Server } = require("socket.io");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use("/recycle", recycleRouter);

app.listen(PORT, () => {
  console.log("Running Server");
});

const io = new Server(3000);

io.on("connection", (socket) => {
  socket.on("helloclient", (arg) => {
    console.log("helloclient 받음", arg);
  });
  setInterval(() =>
    socket.emit(
      "hello",
      [100000000 * Math.random(), Date(Date.now())],
      1
    )
  );

  setInterval(() =>
    socket.emit(
      "hello2",
      [100000000 * Math.random(), Date(Date.now())],
      1
    )
  );

  setInterval(() =>
    socket.emit(
      "hello3",
      [100000000 * Math.random(), Date(Date.now())],
      1
    )
  );

  setInterval(() =>
    socket.emit(
      "hello4",
      [100000000 * Math.random(), Date(Date.now())],
      1
    )
  );
  
  socket.on("joinRoom", ({ joinRoom }) => {
    socket.join(joinRoom);
    io.to(joinRoom).emit("helloTestRoom", "helloTestRoom");
    console.log(joinRoom);
  });
});

initDb();

Post.insertMany([
  {
    uid: createUid(),
    title: "뀨뀨뀨",
    age: parseInt(36 * Math.random()),
  },
  {
    uid: createUid(),
    title: "뀨뀨뀨",
    age: parseInt(36 * Math.random()),
  },
  {
    uid: createUid(),
    title: "뀨뀨뀨",
    age: parseInt(36 * Math.random()),
  },
  {
    uid: createUid(),
    title: "뀨뀨뀨",
    age: parseInt(36 * Math.random()),
  },
  {
    uid: createUid(),
    title: "뀨뀨뀨",
    age: parseInt(36 * Math.random()),
  },
  {
    uid: createUid(),
    title: "뀨뀨뀨",
    age: parseInt(36 * Math.random()),
  },
  {
    uid: createUid(),
    title: "뀨뀨뀨",
    age: parseInt(36 * Math.random()),
  },
  {
    uid: createUid(),
    title: "뀨뀨뀨",
    age: parseInt(36 * Math.random()),
  },
  {
    uid: createUid(),
    title: "뀨뀨뀨",
    age: parseInt(36 * Math.random()),
  },
  {
    uid: createUid(),
    title: "뀨뀨뀨",
    age: parseInt(36 * Math.random()),
  },
  {
    uid: createUid(),
    title: "뀨뀨뀨",
    age: parseInt(36 * Math.random()),
  },
  {
    uid: createUid(),
    title: "뀨뀨뀨",
    age: parseInt(36 * Math.random()),
  },
  {
    uid: createUid(),
    title: "뀨뀨뀨",
    age: parseInt(36 * Math.random()),
  },
  {
    uid: createUid(),
    title: "뀨뀨뀨",
    age: parseInt(36 * Math.random()),
  },
]);

Post.findById({ uid: "AS3Mxf8D0Gr6nRU19278" });

app.get("/user", async (req, res) => {
  const user = await Post.find({});
  res.send(user);
});
