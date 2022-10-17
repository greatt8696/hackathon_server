const mongoDb = require("mongoose");
const { createUid } = require("../util/createRandom");
const { Organization, Post, User } = require("./models");

initDb = function () {
  mongoDb
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((e) => {
      console.error(e);
    });

  // Post.insertMany([
  //   {
  //     uid: createUid(),
  //     title: "뀨뀨뀨",
  //     age: parseInt(36 * Math.random()),
  //   },
  //   {
  //     uid: createUid(),
  //     title: "뀨뀨뀨",
  //     age: parseInt(36 * Math.random()),
  //   },
  //   {
  //     uid: createUid(),
  //     title: "뀨뀨뀨",
  //     age: parseInt(36 * Math.random()),
  //   },
  //   {
  //     uid: createUid(),
  //     title: "뀨뀨뀨",
  //     age: parseInt(36 * Math.random()),
  //   },
  //   {
  //     uid: createUid(),
  //     title: "뀨뀨뀨",
  //     age: parseInt(36 * Math.random()),
  //   },
  //   {
  //     uid: createUid(),
  //     title: "뀨뀨뀨",
  //     age: parseInt(36 * Math.random()),
  //   },
  //   {
  //     uid: createUid(),
  //     title: "뀨뀨뀨",
  //     age: parseInt(36 * Math.random()),
  //   },
  //   {
  //     uid: createUid(),
  //     title: "뀨뀨뀨",
  //     age: parseInt(36 * Math.random()),
  //   },
  //   {
  //     uid: createUid(),
  //     title: "뀨뀨뀨",
  //     age: parseInt(36 * Math.random()),
  //   },
  //   {
  //     uid: createUid(),
  //     title: "뀨뀨뀨",
  //     age: parseInt(36 * Math.random()),
  //   },
  //   {
  //     uid: createUid(),
  //     title: "뀨뀨뀨",
  //     age: parseInt(36 * Math.random()),
  //   },
  //   {
  //     uid: createUid(),
  //     title: "뀨뀨뀨",
  //     age: parseInt(36 * Math.random()),
  //   },
  //   {
  //     uid: createUid(),
  //     title: "뀨뀨뀨",
  //     age: parseInt(36 * Math.random()),
  //   },
  //   {
  //     uid: createUid(),
  //     title: "뀨뀨뀨",
  //     age: parseInt(36 * Math.random()),
  //   },
  // ]);

  // Post.findById({ uid: "AS3Mxf8D0Gr6nRU19278" });
};

mongoDb.Promise = global.Promise;

module.exports = { mongoDb, initDb };
