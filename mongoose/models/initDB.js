const {
  Schema,
  connect,
  mongo: { ObjectId },
} = require("mongoose");
const { createObjectId } = require("../../util/createRandom");
const { Organization, User, Asset, Recycle } = require("./");

const dummyDatas = require("./dummyData.json");

const asset = dummyDatas.Asset;

connect();

module.exports = { initDb, createObjectId };
