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
const { userSocket } = require("../../socket");

const initCoinList = () => {
  const coinList = Object.values(constance.coinList);

  const filterdsubList = coinList.filter(({ sub }) => sub);

  const subList = [];

  filterdsubList.forEach(({ sub }) =>
    Object.values(sub).forEach((value) => subList.push(value))
  );

  return CoinList.insertMany([constance.coinList.greencoin, ...subList]);
};

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

  validateDB = async function (ticker, expectedBalance) {
    const wallet = await Wallet.findOne({ walletId: this.wallet.walletId });
    const coin = wallet.coins.find((coin) => coin.ticker === ticker);
    return coin.balance === expectedBalance ? true : false;
  };
}

const transferAsset = async ({ from, to, ticker, balance }) => {
  return new Promise(async (resolve, reject) => {
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

    const fromCheckBalance = fromWM.checkBalance(ticker, balance);
    if (!fromCheckBalance)
      reject(`발송거부 : ${from} -> ${to} ${ticker} : ${balance}`);

    fromWM.decreaseBalance(ticker, balance);
    toWM.increaseBalance(ticker, balance);

    const fromExpectedBalance = fromWallet.coins.find(
      (coin) => coin.ticker === ticker
    ).balance;
    const toExpectedBalance = fromWallet.coins.find(
      (coin) => coin.ticker === ticker
    ).balance;

    if (!fromWM.validateDB(ticker, fromExpectedBalance))
      reject("이미 반영된 송금트랜잭션입니다.");

    await fromWM.saveWallet();
    await toWM.saveWallet();

    const fromBalance = fromWM.wallet.coins.find(
      (coin) => coin.ticker === ticker
    );
    const toBalance = toWM.wallet.coins.find((coin) => coin.ticker === ticker);

    const msg = `walletId: ${fromWM.wallet.walletId}가 walletId: ${toWM.wallet.walletId}에게 ${ticker}: ${balance}원을 송금하였습니다.`;
    const afterBalance = `${fromWM.wallet.walletId} : ${fromBalance.balance},  ${toWM.wallet.walletId} : ${toBalance.balance}`;

    resolve({ fromWM, toWM, ticker, balance, msg, afterBalance });
  });
};

module.exports = { initCoinList, addCoin, WalletManager, transferAsset };
