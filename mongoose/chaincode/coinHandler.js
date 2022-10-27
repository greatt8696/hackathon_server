require("dotenv").config();
const {
  Wallet,
  User,
  TechFund,
  GreenFund,
  RecycleWallet,
  CoinList,
  TransferLedger,
} = require("../models");

require("../../util/jsonUtil");

const constance = require("../constance/constance");

const { userSocket } = require("../../socket");
const { dataHash } = require("../../util/crypto");

const initCoinList = () => {
  const coinList = Object.values(constance.coinList);

  const filterdsubList = coinList.filter(({ sub }) => sub);

  const subList = [];

  filterdsubList.forEach(({ sub }) =>
    Object.values(sub).forEach((value) => subList.push(value))
  );

  return CoinList.insertMany([constance.coinList.greencoin, ...subList]);
};

class WalletManager {
  constructor(wallet) {
    if (!wallet) throw new Error("해당 ID의 지갑을 찾지 못하였습니다.");
    this.wallet = wallet.immer();
  }

  checkBalance = function (inputTicker, inputBalance) {
    // console.log(this.wallet);
    const list = [...this.wallet.coins];
    const isExistTicker = list.find(({ ticker }) => ticker === inputTicker);
    if (!isExistTicker) return false;
    return isExistTicker.balance >= inputBalance ? true : false;
  };

  getBalane = function (inputTicker) {
    return this.wallet.coins.immer().find((coin) => coin.ticker === inputTicker)
      .balance;
  };

  getCoins = function () {
    // ["111","111","111","111"]
    return this.wallet.coins.immer().map((coin) => coin.ticker);
  };

  setBalance = async function (inputTicker, inputBalance) {
    const list = this.wallet.coins.immer();
    const isExistTicker = list.find(({ ticker }) => ticker === inputTicker);
    // coins 리스트에 없을경우 coinlist 추가
    if (!isExistTicker) {
      // console.log("before findCoinList", inputTicker);
      const findCoinList = await CoinList.find({ ticker: inputTicker });
      // console.log("findCoinList", inputTicker, findCoinList[0]);
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
            ? { ...coin, balance: inputBalance }
            : coin
        ),
    ];
  };
  increaseBalance = async function (inputTicker, inputBalance) {
    const list = this.wallet.coins.immer();
    const isExistTicker = list.find(({ ticker }) => ticker === inputTicker);
    // coins 리스트에 없을경우 coinlist 추가
    if (!isExistTicker) {
      // console.log("before findCoinList", inputTicker);
      const findCoinList = await CoinList.find({ ticker: inputTicker });
      // console.log("findCoinList", inputTicker, findCoinList[0]);
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
      // console.log("before findCoinList", inputTicker);
      const findCoinList = await CoinList.find({ ticker: inputTicker });
      // console.log("findCoinList", inputTicker, findCoinList[0]);
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
            ? { ...coin, balance: coin.balance - inputBalance }
            : coin
        ),
    ];
  };

  saveWallet = async function () {
    return Wallet.findOneAndUpdate(
      { walletId: this.wallet.walletId },
      { ...this.wallet.immer() }
    );
  };

  validateDB = async function (ticker, expectedBalance) {
    const wallet = await Wallet.findOne({
      walletId: this.wallet.walletId,
    });
    const coin = wallet.coins.find((coin) => coin.ticker === ticker);
    return coin.balance === expectedBalance ? true : false;
  };
}

const transferAsset = async ({ from, to, ticker, balance }) => {
  return new Promise(async (resolve, reject) => {
    const payload = { from, to, ticker, balance };
    const hashed = await dataHash(payload);
    await TransferLedger.create({ ...payload, hashed });

    const fromWM = new WalletManager(from);
    const toWM = new WalletManager(to);

    await fromWM.saveWallet();
    await toWM.saveWallet();

    const fromCheckBalance = fromWM.checkBalance(ticker, balance);
    if (!fromCheckBalance)
      reject(
        `발송거부 유효하지 않은 잔액 : 
        ${from.wallet} -> ${to.wallet}  ${ticker} : ${balance}`
      );

    const msg = `walletId: ${fromWM.wallet.walletId}가 walletId: ${toWM.wallet.walletId}에게 ${ticker}: ${balance}원을 송금하였습니다.`;
    const afterBalance = `${fromWM.wallet.walletId} : ${fromWM.getBalane(
      ticker
    )},  ${toWM.wallet.walletId} : ${toWM.getBalane(ticker)}`;

    resolve({ from, to, ticker, balance, msg, afterBalance });
  });
};

module.exports = { initCoinList, transferAsset, WalletManager };
