require("dotenv").config();

const mongoDb = require("mongoose");
const { createUid } = require("../util/createRandom");
const {
  Organization,
  User,
  TechFund,
  GreenFund,
  Recycle,
} = require("./models");

const connectDb = function () {
  return mongoDb
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((e) => {
      console.error(e);
    });
};

const initDb = async function () {
  const deletedOrganization = await Organization.deleteAll();
  const deletedUser = await User.deleteAll();
  const deletedTechFund = await TechFund.deleteAll();
  const deletedGreenFund = await GreenFund.deleteAll();
  const deletedRecycle = await Recycle.deleteAll();
  console.log("db init 초기화 완료");
};

mongoDb.Promise = global.Promise;

module.exports = { connectDb, initDb };
