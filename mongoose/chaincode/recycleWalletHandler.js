const {
  Wallet,
  RecycleWorldTransactions,
  User,
  TechFund,
  GreenFund,
  RecycleLedger,
  RecycleWallet,
} = require("../models");

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
  createObjectId,
} = require("../util");
const { recyclesList } = require("../../recycleSimulation");

class RecycleWalletManager {
  constructor(recycleWallet) {
    if (!recycleWallet) throw new Error("해당 ID의 지갑을 찾지 못하였습니다.");
    this.recycleWallet = recycleWallet.immer();
  }

  checkWeight = function (inputTicker, inputweight) {
    const list = [...this.recycleWallet.ownWastes];
    const isExistTicker = list.find(({ ticker }) => ticker === inputTicker);
    if (!isExistTicker) return false;
    return isExistTicker.weight >= inputweight ? true : false;
  };

  getBalane = function (inputTicker) {
    return this.recycleWallet.ownWastes
      .immer()
      .find((waste) => waste.ticker === inputTicker).weight;
  };

  getAllWastes = function () {
    return this.recycleWallet.ownWastes
      .immer()
      .filter((waste) => waste.ticker < 0);
  };

  getExistWastes = function () {
    const existWaste = this.recycleWallet.ownWastes
      .immer()
      .filter((waste) => waste.ticker > 0);
    return;
    existWaste;
  };

  setweight = async function (inputTicker, inputweight) {
    const list = this.recycleWallet.ownWastes.immer();
    const isExistTicker = list.find(({ ticker }) => ticker === inputTicker);
    // wastes 리스트에 없을경우 wastelist 추가
    if (!isExistTicker) {
      // console.log("before findwasteList", inputTicker);
      const findwasteList = await wasteList.find({ ticker: inputTicker });
      // console.log("findwasteList", inputTicker, findwasteList[0]);
      if (findwasteList.isEmpty()) throw new Error("등록되지 않은 코인입니다.");

      const { ticker, name } = findwasteList[0];
      this.recycleWallet.ownWastes = [
        ...this.recycleWallet.ownWastes.immer(),
        { ticker, name, weight: 0 },
      ];
    }
    this.recycleWallet.ownWastes = [
      ...this.recycleWallet.ownWastes
        .immer()
        .map((waste) =>
          waste.ticker === inputTicker
            ? { ...waste, weight: inputweight }
            : waste
        ),
    ];
  };

  increaseweight = async function (inputTicker, inputweight) {
    const list = this.recycleWallet.ownWastes.immer();
    const isExistTicker = list.find(({ ticker }) => ticker === inputTicker);
    // wastes 리스트에 없을경우 wastelist 추가
    if (!isExistTicker) {
      // console.log("before findwasteList", inputTicker);
      const findwasteList = await wasteList.find({ ticker: inputTicker });
      // console.log("findwasteList", inputTicker, findwasteList[0]);
      if (findwasteList.isEmpty()) throw new Error("등록되지 않은 코인입니다.");

      const { ticker, name } = findwasteList[0];
      this.recycleWallet.ownWastes = [
        ...this.recycleWallet.ownWastes.immer(),
        { ticker, name, weight: 0 },
      ];
    }
    this.recycleWallet.ownWastes = [
      ...this.recycleWallet.ownWastes
        .immer()
        .map((waste) =>
          waste.ticker === inputTicker
            ? { ...waste, weight: waste.weight + inputweight }
            : waste
        ),
    ];
  };

  decreaseweight = async function (inputTicker, inputweight) {
    const list = this.recycleWallet.ownWastes.immer();
    const isExistTicker = list.find(({ ticker }) => ticker === inputTicker);
    // wastes 리스트에 없을경우 wastelist 추가
    if (!isExistTicker) {
      // console.log("before findwasteList", inputTicker);
      const findwasteList = await wasteList.find({ ticker: inputTicker });
      // console.log("findwasteList", inputTicker, findwasteList[0]);
      if (findwasteList.isEmpty()) throw new Error("등록되지 않은 코인입니다.");

      const { ticker, name } = findwasteList[0];
      this.recycleWallet.ownWastes = [
        ...this.recycleWallet.ownWastes.immer(),
        { ticker, name, weight: 0 },
      ];
    }
    this.recycleWallet.ownWastes = [
      ...this.recycleWallet.ownWastes
        .immer()
        .map((waste) =>
          waste.ticker === inputTicker
            ? { ...waste, weight: waste.weight - inputweight }
            : waste
        ),
    ];
  };

  saveRecycleWallet = async function () {
    return recycleWallet.findOneAndUpdate(
      { recycleWalletId: this.recycleWallet.recycleWalletId },
      { ...this.recycleWallet.immer() }
    );
  };

  validateDB = async function (ticker, expectedweight) {
    const recycleWallet = await recycleWallet.findOne({
      recycleWalletId: this.recycleWallet.recycleWalletId,
    });
    const waste = recycleWallet.ownWastes.find(
      (waste) => waste.ticker === ticker
    );
    return waste.weight === expectedweight ? true : false;
  };
}

const createNewRecycleWallet = async (idx) => {
  const recycleWalletId = createObjectId();
  const ownWastes = recyclesList();
  return await RecycleWallet.create({
    recycleWalletId,
    ownWastes,
  });
};

const createBotRecycleWallets = (awalletSize) => {
  const idxList = Array(awalletSize)
    .fill(false)
    .map((_, idx) => idx);

  const newwallets = idxList.map((idx) => {
    const recycleWalletId = makeBotObjectId(idx);
    const ownWastes = recyclesList();
    return {
      recycleWalletId,
      ownWastes,
    };
  });
  return RecycleWallet.insertMany(newwallets);
};

const addwaste = async (walletId, ticker) => {
  const tempId = walletId;
  const wallet = await RecycleWallet.findOne({ walletId: tempId });
  const oldwasteList = wallet.ownWastes;
  const newwaste = makewaste(ticker);
  const newwastes = [...oldwasteList, newwaste];

  console.log("addwaste", { ...wallet, wastes: newwastes });

  const update = await RecycleWallet.replaceOne(
    { walletId: tempId },
    { wastes: newwastes }
  );

  const result = await RecycleWallet.findOne({ walletId: tempId });
  console.log("addwaste", result);
};

const transferRecycle = async ({ lastFromTo, ticker, weight }) => {
  return new Promise(async (resolve, reject) => {
    const payload = { lastFromTo, ticker, weight };
    const hashed = await dataHash(payload);
    // console.log({ ...payload, hashed });
    const transferred = await RecycleLedger.create({ ...payload, hashed });
    const { from, to } = transferred.lastFromTo;
    const fromWM = new RecycleWalletManager(from);
    const toWM = new RecycleWalletManager(to);

    await fromWM.saveRecycleWallet();
    await toWM.saveRecycleWallet();

    const fromCheckWeight = fromWM.checkWeight(ticker, weight);
    if (!fromCheckWeight)
      reject(
        `발송거부 유효하지 않은 잔액 : ${from.wallet} -> ${to.wallet} ${ticker} : ${weight}`
      );

    const msg = `recycleWalletId: ${fromWM.recycleWallet.recycleWalletId}가 recycleWalletId: ${toWM.recycleWallet.recycleWalletId}에게 ${ticker}: ${weight}원을 송금하였습니다.`;
    const afterWeight = `${
      fromWM.recycleWallet.recycleWalletId
    } : ${fromWM.getBalane(ticker)},  ${
      toWM.recycleWallet.recycleWalletId
    } : ${toWM.getBalane(ticker)}`;

    resolve({ fromWM, toWM, ticker, weight, msg, afterWeight });
  });
};

module.exports = {
  createBotRecycleWallets,
  addwaste,
  createNewRecycleWallet,
  transferRecycle,
  RecycleWalletManager,
};
