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

// mongoDb.Promise = global.Promise;



module.exports = { mongoDb, initDb };
