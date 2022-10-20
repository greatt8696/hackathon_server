require("dotenv").config();

const mongoDb = require("mongoose");
const { createUid } = require("../util/createRandom");
const {
  Wallet,
  User,
  TechFund,
  GreenFund,
  RecycleLedger,
  RecycleTransactions,
} = require("./models");

const {
  user,
  wallet,
  recycleLedger,
  recycle,
  techFund,
  greenFund,
} = require("../recycleSimulation");

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
  const deletedWallet = await Wallet.deleteAll();
  const deletedUser = await User.deleteAll();
  const deletedTechFund = await TechFund.deleteAll();
  const deletedGreenFund = await GreenFund.deleteAll();
  const deletedRecycle = await RecycleLedger.deleteAll();
  const recycleTransactions = await RecycleTransactions.deleteAll();
  Wallet.insertMany(wallet);
  User.insertMany(user);
  TechFund.insertMany(techFund);
  GreenFund.insertMany(greenFund);
  RecycleLedger.insertMany(recycleLedger);
  RecycleTransactions.insertMany(recycleLedger);
  console.log("db init 초기화 완료");
};

mongoDb.Promise = global.Promise;

module.exports = { connectDb, initDb };
