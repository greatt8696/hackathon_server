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
const { createBotUsers, UserManager } = require("./chaincode/userHandler");
const {
  initCoinList,
  transferAsset,
  WalletManager,
} = require("./chaincode/coinHandler");
const { userSocket } = require("../socket");
const { hash } = require("../util/crypto");
const {
  createBotRecycleWallets,
  RecycleWalletManager,
} = require("./chaincode/recycleWalletHandler");

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
const transferAssetBot = async (allUsers) => {
  setInterval(async () => {
    try {
      const sender = chooseRandom(allUsers);
      const receiver = chooseRandom(allUsers);
      const ticker = "GREEN";
      const balance = parseInt(Math.random() * 500000);

      const from = new UserManager(sender);
      const to = new UserManager(receiver);

      const fromWM = await from.getWallet();
      const isCheck = fromWM.checkBalance(ticker, balance);
      if (!isCheck) throw new Error("유효하지 않은 잔액입니다.");

      fromWM.decreaseBalance(ticker, balance);

      const toWM = await to.getWallet();
      toWM.increaseBalance(ticker, balance);

      const transfer = await transferAsset({
        lastFromTo: { from: fromWM.wallet, to: toWM.wallet },
        ticker: "GREEN",
        balance,
      });

      userSocket.emit("transfer", transfer);
    } catch (error) {
      console.log(error);
      userSocket.emit("transfer", { reject: error });
    }
  }, 100);
};

const recycleTransferBot = async (allUsers) => {
  const createUsers = allUsers.shift();
  const publicUsers = allUsers.filter(({ role }) => role === "지자체");
  const collectUsers = allUsers.filter(({ role }) => role === "수거");
  const transferUsers = allUsers.filter(({ role }) => role === "운송");
  const selectUsers = allUsers.filter(({ role }) => role === "선별");
  const landfillUsers = allUsers.filter(({ role }) => role === "매립");
  const incinerateUsers = allUsers.filter(({ role }) => role === "소각");
  const processUsers = allUsers.filter(({ role }) => role === "가공");

  const SELECT_RECYCLE = [25, 50, 100];
  const ACTION_ORDER_TABLE = new Array(10).fill(false).map((_, idx) => idx);

  const recycleAction = {
    create: async (ticker, balance) => {
      try {
        const publicRandom = chooseRandom(publicUsers);
        const from = new UserManager(createUsers);
        const to = new UserManager(publicRandom);

        const fromRecycleWallet = await from.getRecyleWallet();
        const toRecycleWallet = await to.getRecyleWallet();

        console.log(
          fromRecycleWallet.recycleWallet,
          toRecycleWallet.recycleWallet
        );

        const fromWM = await from.getWallet();
        const isCheck = fromWM.checkBalance(ticker, balance);

        if (!isCheck) throw new Error("유효하지 않은 잔액입니다.");

        fromWM.decreaseBalance(ticker, balance);

        const toWM = await to.getWallet();
        toWM.increaseBalance(ticker, balance);

        const transfer = await transferAsset({
          lastFromTo: { from: fromWM.wallet, to: toWM.wallet },
          ticker: "GREEN",
          balance,
        });
      } catch (error) {}
    },
    transfer: () => {
      const transferRandom = chooseRandom(transferUsers);
      const fromRandom = chooseRandom(allUsers);
      const toRandom = chooseRandom(allUsers);
      const transfer = new UserManager(transferRandom);
      const from = new UserManager(fromRandom);
      const to = new UserManager(toRandom);
    },
    collect: () => {
      const publicRandom = chooseRandom(publicUsers);
      const collectRandom = chooseRandom(collectUsers);
      const from = new UserManager(publicRandom);
      const to = new UserManager(collectRandom);
    },
    select: () => {
      const collectRandom = chooseRandom(collectUsers);
      const selectRandom = chooseRandom(selectUsers);
      const from = new UserManager(collectRandom);
      const to = new UserManager(selectRandom);
    },
    landfill: () => {},
    incinerate: () => {},
    process: () => {},
  };

  setInterval(async () => {
    const publicRandom = chooseRandom(publicUsers);
    const collectRandom = chooseRandom(collectUsers);
    const transferRandom = chooseRandom(transferUsers);
    const selectRandom = chooseRandom(selectUsers);
    const landfillRandom = chooseRandom(landfillUsers);
    const incinerateRandom = chooseRandom(incinerateUsers);
    const processRandom = chooseRandom(processUsers);

    console.log(publicRandom.recycleWalletId);
    console.log(collectRandom.recycleWalletId);
    console.log(transferRandom.recycleWalletId);
    console.log(selectRandom.recycleWalletId);
    console.log(landfillRandom.recycleWalletId);
    console.log(incinerateRandom.recycleWalletId);
    console.log(processRandom.recycleWalletId);

    await recycleAction.create();
  }, 100);
};

const initDb = async function () {
  // createDbDatas();
  const allUsers = await User.findAll();

  transferAssetBot(allUsers);
  recycleTransferBot(allUsers);
};

module.exports = { connectDb, initDb };
