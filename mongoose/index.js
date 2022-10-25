require("dotenv").config();

const mongoDb = require("mongoose");
const { createUid, chooseRandom } = require("../util/createRandom");
const {
  Wallet,
  User,
  TechFund,
  GreenFund,
  RecycleLedger,
  RecycleWorldTransactions,
  CoinList,
  TransferLedger,
} = require("./models");
const {
  mongo: { ObjectId },
} = require("mongoose");

const {
  recycleLedger,
  recycleWorldTransaction,
  techFund,
  greenFund,
} = require("../recycleSimulation");
const { createBotWallets, addCoin } = require("./chaincode/walletHandler");
const { createBotUsers } = require("./chaincode/userHandler");
const { initCoinList, transferAsset } = require("./chaincode/coinHandler");
const { userSocket } = require("../socket");
const { hash } = require("../util/crypto");

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

const createDbDatas = async () => {
  await Wallet.deleteAll();
  await User.deleteAll();
  await CoinList.deleteAll();
  await TechFund.deleteAll();
  await GreenFund.deleteAll();
  await RecycleLedger.deleteAll();
  await RecycleWorldTransactions.deleteAll();

  TechFund.insertMany(techFund);
  GreenFund.insertMany(greenFund);
  RecycleLedger.insertMany(recycleLedger);
  RecycleWorldTransactions.insertMany(recycleWorldTransaction);
  console.log("db init 초기화 완료");

  const BOT_USER_SIZE = 22222;
  createBotWallets(BOT_USER_SIZE)
    .then((result) => console.log("Success: createBotWallets"))
    .catch((err) => {
      console.log(err, "Fail: createBotWallets");
    });
  createBotUsers(BOT_USER_SIZE)
    .then((result) => console.log("Success: createBotUsers"))
    .catch((err) => {
      console.log(err, "Fail: createBotUsers");
    });

  await initCoinList();
};

const transferTest = async () => {
  const allUsers = await User.findAll();

  setInterval(async () => {
    const sender = chooseRandom(allUsers);
    const receiver = chooseRandom(allUsers);

    // console.log(before.coins[0].balance);
    try {
      //const balance = parseInt(Math.random() * 500000);
      const balance = parseInt(50000000);

      const from = await Wallet.findOne({ walletId: sender.walletId });
      const to = await Wallet.findOne({ walletId: receiver.walletId });

      const transfer = await transferAsset({
        from,
        to,
        ticker: "GREEN",
        balance,
      });

      userSocket.emit("transfer", transfer);
    } catch (error) {
      userSocket.emit("transfer", { reject: error });
    }

    // console.log(after.coins[0].balance);
  }, 100);
};

const initDb = async function () {
  // createDbDatas();
  transferTest();

  setInterval(async () => {
    const allWallets = await Wallet.findAll();
    const test = allWallets.filter(({ coins }) => {
      return !coins.filter(({ balance }) => balance < 0).isEmpty();
    });
    console.log(test.length);
  }, 800);

  // const public = allUsers.filter(({ role }) => role === "지자체");
  // const collector = allUsers.filter(({ role }) => role === "수거");
  // const landfill = allUsers.filter(({ role }) => role === "매립");
  // const processing = allUsers.filter(({ role }) => role === "가공");

  // const publicWallet = chooseRandom(public).walletId;
  // CoinList.isExist("GREEN").then((result) => console.log(result));
  // console.log(publicWallet);
  // console.log(public.length);
  // console.log(collector.length);
  // console.log(landfill.length);
  // console.log(processing.length);
};

module.exports = { connectDb, initDb };
