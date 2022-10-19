const {
  Schema,
  mongo: { ObjectId },
} = require("mongoose");
const { createObjectId } = require("../../util/createRandom");
const { Organization, User, GreenFund, TechFund, Recycle } = require("./");

const dummyDatas = require("./dummyData.json");

const asset = dummyDatas.Asset;

connect();
Organization.deleteAll();
User.deleteAll();
GreenFund.deleteAll();
TechFund.deleteAll();
Recycle.deleteAll();

module.exports = { createObjectId };
