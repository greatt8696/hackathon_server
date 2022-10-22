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
const { createBotWallets, addCoin } = require("./chaincode/walletHandler");
const { createBotUsers } = require("./chaincode/userHandler");

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

  // Wallet.insertMany(wallet);
  TechFund.insertMany(techFund);
  GreenFund.insertMany(greenFund);
  RecycleLedger.insertMany(recycleLedger);
  RecycleWorldTransactions.insertMany(recycleWorldTransaction);
  console.log("db init 초기화 완료");
  // createRandom();

  const BOT_USER_SIZE = 88;

  createBotWallets(BOT_USER_SIZE)
    .then((result) => console.log( "Success: createBotWallets"))
    .catch((err) => {
      console.log(err, "Fail: createBotWallets");
    });

  createBotUsers(BOT_USER_SIZE)
    .then((result) => console.log("Success: createBotUsers"))
    .catch((err) => {
      console.log(err, "Fail: createBotUsers");
    });
};

// const createRandom = async function () {
//   setTimeout(() => {
//     addCoin("111111111111111111111111", "DDDDDDDD");
//   }, 500);
// };

mongoDb.Promise = global.Promise;

module.exports = { connectDb, initDb };
