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
  transferWaste,
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

      const from = new UserManager(sender);
      const fromWM = await from.getWallet();
      const to = new UserManager(receiver);
      const toWM = await to.getWallet();

      const chooseRandomTicker = chooseRandom(fromWM.getCoins());

      const ticker = chooseRandomTicker;
      const balance = parseInt(Math.random() * 500000);

      const isCheck = fromWM.checkBalance(ticker, balance);
      if (!isCheck) throw new Error("유효하지 않은 잔액입니다.");

      fromWM.decreaseBalance(ticker, balance);
      toWM.increaseBalance(ticker, balance);

      const transfer = await transferAsset({
        from: fromWM.wallet,
        to: toWM.wallet,
        ticker: ticker,
        balance,
      });

      userSocket.emit("transfer", transfer);
    } catch (error) {
      console.log(error);
      userSocket.emit("transfer", { reject: error });
    }
  }, 500);
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

  const SELECT_WEIGHT = [0.25, 0.5, 1];
  const ACTION_ORDER_TABLE = new Array(10).fill(false).map((_, idx) => idx);

  const recycleBotAction = {
    create: async () => {
      try {
        const publicRandom = chooseRandom(publicUsers);
        const from = new UserManager(createUsers);
        const to = new UserManager(publicRandom);
        const fromRWM = await from.getRecyleWallet();
        const toRWM = await to.getRecyleWallet();

        const fromWasteList = toRWM.recycleWallet.ownWastes.map(
          (waste) => waste.ticker
        );

        const ticker = chooseRandom(fromWasteList);

        const fromWasteWeight = toRWM.recycleWallet.ownWastes.find(
          (waste) => waste.ticker === ticker
        ).weight;

        const randomWeight = 10000;

        toRWM.increaseWeight(ticker, randomWeight);

        const transfer = await transferWaste({
          from: fromRWM.recycleWallet,
          to: toRWM.recycleWallet,
          ticker,
          randomWeight,
        });

        // console.log(toRWM.recycleWallet, "@@@@@@@@@@@@@@@@@@@@@create");

        userSocket.emit("recycle", transfer);
      } catch (error) {
        console.error(error);
      }
    },
    transfer: () => {
      const transferRandom = chooseRandom(transferUsers);
      const fromRandom = chooseRandom(allUsers);
      const toRandom = chooseRandom(allUsers);
      const transfer = new UserManager(transferRandom);
      const from = new UserManager(fromRandom);
      const to = new UserManager(toRandom);
    },

    collect: async () => {
      try {
        const publicRandom = chooseRandom(publicUsers);
        const collectRandom = chooseRandom(collectUsers);
        const from = new UserManager(publicRandom);
        const to = new UserManager(collectRandom);
        const fromRWM = await from.getRecyleWallet();
        const toRWM = await to.getRecyleWallet();

        const fromExistWastes = fromRWM.recycleWallet.ownWastes.filter(
          (waste) => waste.weight > 0
        );

        const Lists = fromExistWastes.map((wastes) => wastes.ticker);

        const ticker = chooseRandom(Lists);

        const tempWeight = fromRWM.recycleWallet.ownWastes.find(
          (waste) => waste.ticker === ticker
        ).weight;

        const fromWasteWeight = tempWeight !== undefined ? tempWeight : 0;

        const randomWeight = fromWasteWeight * chooseRandom(SELECT_WEIGHT);

        const isCheck = fromRWM.checkWeight(ticker, randomWeight);
        if (!isCheck) throw new Error("유효하지 않은 재활용입출요청입니다.");

        fromRWM.decreaseWeight(ticker, randomWeight);
        toRWM.increaseWeight(ticker, randomWeight);

        // console.log("@@@@@@", fromWasteWeight);
        const transfer = await transferWaste({
          from: fromRWM.recycleWallet,
          to: toRWM.recycleWallet,
          ticker,
          weight: randomWeight,
        });

        // console.log("@@@@@@@@@@@@@@@@@@@@@collect", {
        //   from: fromRWM.recycleWallet,
        //   to: toRWM.recycleWallet,
        //   ticker,
        //   weight: randomWeight,
        // });

        console.log("recycle  성공");
        userSocket.emit("recycle", transfer);
      } catch (error) {
        console.error(error);
      }
    },

    select: async () => {
      try {
        const collectRandom = chooseRandom(collectUsers);
        const selectRandom = chooseRandom(selectUsers);
        const from = new UserManager(collectRandom);
        const to = new UserManager(selectRandom);
        const fromRWM = await from.getRecyleWallet();
        const toRWM = await to.getRecyleWallet();

        const fromExistWastes = fromRWM.recycleWallet.ownWastes.filter(
          (waste) => waste.weight > 0
        );

        const Lists = fromExistWastes.map((wastes) => wastes.ticker);

        const ticker = chooseRandom(Lists);

        const tempWeight = fromRWM.recycleWallet.ownWastes.find(
          (waste) => waste.ticker === ticker
        ).weight;

        const fromWasteWeight = tempWeight !== undefined ? tempWeight : 0;

        const randomWeight = fromWasteWeight * chooseRandom(SELECT_WEIGHT);

        const isCheck = fromRWM.checkWeight(ticker, randomWeight);
        if (!isCheck) throw new Error("유효하지 않은 재활용입출요청입니다.");

        fromRWM.decreaseWeight(ticker, randomWeight);
        toRWM.increaseWeight(ticker, randomWeight);

        // console.log("@@@@@@", fromWasteWeight);
        const transfer = await transferWaste({
          from: fromRWM.recycleWallet,
          to: toRWM.recycleWallet,
          ticker,
          weight: randomWeight,
        });

        // console.log("@@@@@@@@@@@@@@@@@@@@@collect", {
        //   from: fromRWM.recycleWallet,
        //   to: toRWM.recycleWallet,
        //   ticker,
        //   weight: randomWeight,
        // });

        console.log("recycle  성공");
        userSocket.emit("recycle", transfer);
      } catch (error) {
        console.error(error);
      }
    },
    landfill: async () => {
      const collectRandom = chooseRandom(collectUsers);
      const selectRandom = chooseRandom(selectUsers);
      const from = new UserManager(collectRandom);
      const to = new UserManager(selectRandom);
    },
    incinerate: async () => {
      try {
        const collectRandom = chooseRandom([...collectUsers, ...selectUsers]);
        const incinerateRandom = chooseRandom(incinerateUsers);
        const from = new UserManager(collectRandom);
        const to = new UserManager(incinerateRandom);
        const fromRWM = await from.getRecyleWallet();
        const toRWM = await to.getRecyleWallet();

        const fromExistWastes = fromRWM.recycleWallet.ownWastes.filter(
          (waste) => waste.weight > 0
        );

        const Lists = fromExistWastes.map((wastes) => wastes.ticker);

        const ticker = chooseRandom(Lists);

        const tempWeight = fromRWM.recycleWallet.ownWastes.find(
          (waste) => waste.ticker === ticker
        ).weight;

        const fromWasteWeight = tempWeight !== undefined ? tempWeight : 0;

        const randomWeight = fromWasteWeight * chooseRandom(SELECT_WEIGHT);

        const isCheck = fromRWM.checkWeight(ticker, randomWeight);
        if (!isCheck) throw new Error("유효하지 않은 재활용입출요청입니다.");

        fromRWM.decreaseWeight(ticker, randomWeight);
        toRWM.increaseWeight(ticker, randomWeight);

        // console.log("@@@@@@", fromWasteWeight);
        const transfer = await transferWaste({
          from: fromRWM.recycleWallet,
          to: toRWM.recycleWallet,
          ticker,
          weight: randomWeight,
        });

        // console.log("@@@@@@@@@@@@@@@@@@@@@collect", {
        //   from: fromRWM.recycleWallet,
        //   to: toRWM.recycleWallet,
        //   ticker,
        //   weight: randomWeight,
        // });

        console.log("recycle  성공");
        userSocket.emit("recycle", transfer);
      } catch (error) {
        console.error(error);
      }
    },
    process: async () => {
      const collectRandom = chooseRandom(collectUsers);
      const selectRandom = chooseRandom(selectUsers);
      const from = new UserManager(collectRandom);
      const to = new UserManager(selectRandom);
    },
  };

  setInterval(async () => {
    const publicRandom = chooseRandom(publicUsers);
    const collectRandom = chooseRandom(collectUsers);
    const transferRandom = chooseRandom(transferUsers);
    const selectRandom = chooseRandom(selectUsers);
    const landfillRandom = chooseRandom(landfillUsers);
    const incinerateRandom = chooseRandom(incinerateUsers);
    const processRandom = chooseRandom(processUsers);

    await recycleBotAction.create();
    await recycleBotAction.create();
    await recycleBotAction.collect();
  }, 500);
};

const initDb = async function () {
  // createDbDatas();
  const allUsers = await User.findAll();

  transferAssetBot(allUsers);
  recycleTransferBot(allUsers);
};

module.exports = { connectDb, initDb };
