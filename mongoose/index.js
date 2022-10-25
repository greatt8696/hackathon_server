require("dotenv").config();

const mongoDb = require("mongoose");
const { createUid, chooseRandom } = require("../util/createRandom");
const {
  Wallet,
  User,
  TechFund,
  GreenFund,
  RecycleWallet,
  RecycleLedger,
  CoinList,
  TransferLedger,
} = require("./models");
const {
  recycleLedger,
  recycleWorldTransaction,
  techFund,
  greenFund,
} = require("../recycleSimulation");
const { createBotWallets } = require("./chaincode/walletHandler");
const { createBotUsers } = require("./chaincode/userHandler");
const {
  initCoinList,
  transferAsset,
  WalletManager,
} = require("./chaincode/coinHandler");
const { userSocket } = require("../socket");
const { hash } = require("../util/crypto");
const { createBotRecycleWallets } = require("./chaincode/recycleWalletHandler");

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
  // await Wallet.deleteAll();
  // await User.deleteAll();
  await CoinList.deleteAll();
  await TechFund.deleteAll();
  await GreenFund.deleteAll();

  TechFund.insertMany(techFund);
  GreenFund.insertMany(greenFund);
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

  createBotRecycleWallets(BOT_USER_SIZE)
    .then((result) => console.log("Success: createBotRecycleWallets"))
    .catch((err) => {
      console.log(err, "Fail: createBotUsers");
    });

  await initCoinList();
};

// api로 옮겨질것
const transferTest = async (allUsers) => {
  // const allUsers = await User.findAll();
  // const sender = chooseRandom(allUsers);
  // const receiver = chooseRandom(allUsers);
  // const ticker = "GREEN";
  // const balance = parseInt(Math.random() * 500000);

  setInterval(async () => {
    try {
      // const balance = parseInt(50000000);
      const sender = chooseRandom(allUsers);
      const receiver = chooseRandom(allUsers);
      const ticker = "GREEN";
      const balance = parseInt(Math.random() * 500000);

      const from = await Wallet.findOne({ walletId: sender.walletId });
      const to = await Wallet.findOne({ walletId: receiver.walletId });

      const fromWM = new WalletManager(from);
      const isCheck = fromWM.checkBalance(ticker, balance);
      if (!isCheck) throw new Error("유효하지 않은 잔액입니다.");
      fromWM.decreaseBalance(ticker, balance);
      const toWM = new WalletManager(to);
      toWM.increaseBalance(ticker, balance);

      const transfer = await transferAsset({
        lastFromTo: { from: fromWM.wallet, to: toWM.wallet },
        ticker: "GREEN",
        balance,
      });

      userSocket.emit("transfer", transfer);
    } catch (error) {
      userSocket.emit("transfer", { reject: error });
    }

    // console.log(after.coins[0].balance);
  }, 10);
};

const initDb = async function () {
  // createDbDatas();

  const allUsers = await User.findAll();
  transferTest(allUsers);

  setInterval(async () => {
    const allWallets = await Wallet.findAll();
    const test = allWallets.filter(({ coins }) => {
      return !coins.filter(({ balance }) => balance < 0).isEmpty();
    });

    console.log(test.length);
  }, 800);
};

module.exports = { connectDb, initDb };
