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
  // await Wallet.deleteAll();
  // await User.deleteAll();
  // await CoinList.deleteAll();
  await TechFund.deleteAll();
  await GreenFund.deleteAll();
  await RecycleLedger.deleteAll();
  await RecycleWorldTransactions.deleteAll();

  TechFund.insertMany(techFund);
  GreenFund.insertMany(greenFund);
  RecycleLedger.insertMany(recycleLedger);
  RecycleWorldTransactions.insertMany(recycleWorldTransaction);
  console.log("db init 초기화 완료");

  const BOT_USER_SIZE = 60000;

  // createBotWallets(BOT_USER_SIZE)
  //   .then((result) => console.log("Success: createBotWallets"))
  //   .catch((err) => {
  //     console.log(err, "Fail: createBotWallets");
  //   });

  // createBotUsers(BOT_USER_SIZE)
  //   .then((result) => console.log("Success: createBotUsers"))
  //   .catch((err) => {
  //     console.log(err, "Fail: createBotUsers");
  //   });

  // await initCoinList();

  const allUsers = await User.findAll();
  // const public = allUsers.filter(({ role }) => role === "지자체");
  // const collector = allUsers.filter(({ role }) => role === "수거");
  // const landfill = allUsers.filter(({ role }) => role === "매립");
  // const processing = allUsers.filter(({ role }) => role === "가공");

  setInterval(async () => {
    const sender = chooseRandom(allUsers);
    const receiver = chooseRandom(allUsers);

    const before = await Wallet.findOne({ walletId: sender.walletId });

    // console.log(before.coins[0].balance);
    await transferAsset({
      from: sender.walletId.toString(),
      to: receiver.walletId.toString(),
      ticker: "GREEN",
      balance: 500000000,
    });
    const after = await Wallet.findOne({ walletId: sender.walletId });
    // console.log(after.coins[0].balance);
    console.log(
      `${sender.name}가 ${receiver.name}에게 ${500000000}원을 송금하였습니다.`
    );
  }, 100);

  // const publicWallet = chooseRandom(public).walletId;

  // CoinList.isExist("GREEN").then((result) => console.log(result));

  // console.log(publicWallet);
  // console.log(public.length);
  // console.log(collector.length);
  // console.log(landfill.length);
  // console.log(processing.length);
};

mongoDb.Promise = global.Promise;

module.exports = { connectDb, initDb };
