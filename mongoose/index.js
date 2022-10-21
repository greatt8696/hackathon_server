require("dotenv").config();

const mongoDb = require("mongoose");
const { createUid } = require("../util/createRandom");
const {
  Wallet,
  User,
  TechFund,
  GreenFund,
  RecycleLedger,
  RecycleWorldTransactions,
} = require("./models");
const {
  mongo: { ObjectId },
} = require("mongoose");

const {
  user,
  wallet,
  recycleLedger,
  recycleWorldTransaction,
  techFund,
  greenFund,
} = require("../recycleSimulation");
const { createNewWallet, addCoin } = require("./chaincode/walletHandler");

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
  await Wallet.deleteAll();
  await User.deleteAll();
  await TechFund.deleteAll();
  await GreenFund.deleteAll();
  await RecycleLedger.deleteAll();
  await RecycleWorldTransactions.deleteAll();

  Wallet.insertMany(wallet);
  User.insertMany(user);
  TechFund.insertMany(techFund);
  GreenFund.insertMany(greenFund);
  RecycleLedger.insertMany(recycleLedger);
  RecycleWorldTransactions.insertMany(recycleWorldTransaction);
  console.log("db init 초기화 완료");
  createRandom();
};

const createRandom = async function () {
  setTimeout(() => {
    createNewWallet(121);
    addCoin("111111111111111111111111", "DDDDDDDD");
  }, 50);
};

mongoDb.Promise = global.Promise;

module.exports = { connectDb, initDb };
