const mongoDb = require("mongoose");
const { createUid } = require("../util/createRandom");
const { Post } = require("./models/Post");

initDb = function () {
  mongoDb
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((e) => {
      console.error(e);
    });
};

mongoDb.Promise = global.Promise;

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

module.exports = { mongoDb, initDb };
