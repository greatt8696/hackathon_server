require("dotenv").config();
const {
  Wallet,
  RecycleWorldTransactions,
  User,
  TechFund,
  GreenFund,
  RecycleLedger,
  CoinList,
} = require("../models");

require("../../util/jsonUtil");

const mongoDb = require("mongoose");

const constance = require("../constance/constance");
const USER_ROLE = constance.userRole;
const {
  ConnectionStates,
  mongo: { ObjectId },
} = require("mongoose");
const { removeDep } = require("../../util/jsonUtil");

const {
  makeId,
  makeUid,
  makeEmail,
  makeRole,
  makeName,
  makerecycleLedgerIds,
  makeBotObjectId,
  makeCoin,
} = require("../util");

const initCoinList = () => {
  const coinList = Object.values(constance.coinList);

  const filterdsubList = coinList.filter(({ sub }) => sub);

  const subList = [];

  filterdsubList.forEach(({ sub }) =>
    Object.values(sub).forEach((value) => subList.push(value))
  );

  return CoinList.insertMany([constance.coinList.greencoin, ...subList]);
};

const checkBalance = async (walletId, ticker) => {};

const addCoin = async (walletId, ticker) => {
  const tempId = walletId;
  const wallet = await Wallet.findOne({ walletId: tempId });
  const oldcoinList = wallet.coins;
  const newCoin = makeCoin(ticker);
  const newCoins = [...oldcoinList, newCoin];
  console.log("addCoin", { ...wallet, coins: newCoins });
  const update = await Wallet.replaceOne(
    { walletId: tempId },
    { coins: newCoins }
  );
  const result = await Wallet.findOne({ walletId: tempId });
  console.log("addCoin", result);
};

class WalletManager {
  constructor(wallet) {
    if (!wallet) throw new Error("해당 ID의 지갑을 찾지 못하였습니다.");
    this.wallet = wallet.immer();
    // this.coinList = makeCoinList(wallet);
  }

  // makeCoinList = ({ coins }) => {
  //   const coinList = {};
  //   coins.forEach(({ ticker, balance }) => {
  //     coinList[ticker] = balance;
  //   });
  //   return coinList;
  // };

  checkBalance = function (inputTicker, inputBalance) {
    const list = [...this.wallet.coins];
    const isExistTicker = list.find(({ ticker }) => ticker === inputTicker);

    if (!isExistTicker) return false;
    return isExistTicker.balance >= inputBalance ? true : false;
  };

  increaseBalance = async function (inputTicker, inputBalance) {
    const list = this.wallet.coins.immer();
    const isExistTicker = list.find(({ ticker }) => ticker === inputTicker);

    // coins 리스트에 없을경우 coinlist 추가
    if (!isExistTicker) {
      console.log("before findCoinList", inputTicker);
      const findCoinList = await CoinList.find({ ticker: inputTicker });
      console.log("findCoinList", inputTicker, findCoinList[0]);
      if (findCoinList.isEmpty()) throw new Error("등록되지 않은 코인입니다.");

      const { ticker, name } = findCoinList[0];
      this.wallet.coins = [
        ...this.wallet.coins.immer(),
        { ticker, name, balance: 0 },
      ];
    }

    this.wallet.coins = [
      ...this.wallet.coins
        .immer()
        .map((coin) =>
          coin.ticker === inputTicker
            ? { ...coin, balance: coin.balance + inputBalance }
            : coin
        ),
    ];
  };

  decreaseBalance = async function (inputTicker, inputBalance) {
    const list = this.wallet.coins.immer();
    const isExistTicker = list.find(({ ticker }) => ticker === inputTicker);

    // coins 리스트에 없을경우 coinlist 추가
    if (!isExistTicker) {
      const findCoinList = await CoinList.find({ ticker: inputTicker });
      if (findCoinList.isEmpty()) throw new Error("등록되지 않은 코인입니다.");

      const { ticker, name } = findCoinList;
      this.wallet.coins = [
        ...this.wallet.coins.immer(),
        { ticker, name, balance: 0 },
      ];
    }

    this.wallet.coins = this.wallet.coins
      .immer()
      .map((coin) =>
        coin.ticker === inputTicker
          ? { ...coin, balance: coin.balance - inputBalance }
          : coin
      );
  };

  saveWallet = async function () {
    return Wallet.findOneAndUpdate(
      { walletId: this.wallet.walletId },
      { ...this.wallet.immer() }
    );
  };
}

const transferAsset = async ({ from, to, ticker, balance }) => {
  return new Promise(async (resolve, _) => {
    const getWallets = await Wallet.find({
      walletId: [ObjectId(from), ObjectId(to)],
    });
    const fromWallet = getWallets.find(
      ({ walletId }) => walletId.toString() === from
    );
    const toWallet = getWallets.find(
      ({ walletId }) => walletId.toString() === to
    );
    const fromWM = new WalletManager(fromWallet);
    const toWM = new WalletManager(toWallet);

    // console.log("송금하는사람 :", fromWM.wallet.coins[0].balance);

    console.log(
      "송금 전 :",
      toWM.wallet.walletId,
      toWM.wallet.coins[0].balance
    );
    fromWM.decreaseBalance(ticker, balance);
    toWM.increaseBalance(ticker, balance);
    await toWM.saveWallet();
    await fromWM.saveWallet();

    const after = await Wallet.findOne({
      walletId: ObjectId(to),
    });
    console.log("송금 후 :", after.walletId, after.coins[0].balance);

    resolve(true);
  });
};

// mongoDb.connect(process.env.MONGO_URI).then(async () => {
//   // console.log(test);
//   try {
//     await transferAsset({
//       from: "000000000000000000005202",
//       to: "000000000000000000002503",
//       ticker: "GREEN",
//       balance: 100000,
//     });
//   } catch (error) {
//     console.error(error);
//   }
//   mongoDb.disconnect();
// });

// const senderWallet = await Wallet.findOne({
//   walletId: ObjectId("000000000000000000000002"),
// });

// const senderWM = new WalletManager(senderWallet);

// for (let idx = 0; idx < 10; idx++) {
//   senderWM.increaseBalance("FLAK_PE", 1);
//   await senderWM.saveWallet();
// }

// for (let idx = 0; idx < 11; idx++) {
//   senderWM.decreaseBalance("FLAK_PE", 1);
//   await senderWM.saveWallet();
// }

// senderWM.decreaseBalance("PAPE_NEWS", 500000);
// console.log(senderWM.wallet);

module.exports = { initCoinList, addCoin, WalletManager, transferAsset };
