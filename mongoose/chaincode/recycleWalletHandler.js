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
const { dataHash } = require("../../util/crypto");

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

  setWeight = async function (inputTicker, inputweight) {
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

  increaseWeight = async function (inputTicker, inputweight) {
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

  decreaseWeight = async function (inputTicker, inputweight) {
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
    return RecycleWallet.findOneAndUpdate(
      { recycleWalletId: this.recycleWallet.recycleWalletId },
      { ...this.recycleWallet.immer() }
    );
  };

  validateDB = async function (ticker, expectedweight) {
    const recycleWallet = await RecycleWallet.findOne({
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

  // console.log("addwaste", { ...wallet, wastes: newwastes });

  const update = await RecycleWallet.replaceOne(
    { walletId: tempId },
    { wastes: newwastes }
  );

  const result = await RecycleWallet.findOne({ walletId: tempId });
  console.log("addwaste", result);
};

const transferWaste = async ({ from, to, ticker, weight }) => {
  return new Promise(async (resolve, reject) => {
    const fromRWM = new RecycleWalletManager(from);

    const fromCheckWeight =
      from.recycleWalletId !== "000000000000000000000000"
        ? fromRWM.checkWeight(ticker, weight)
        : true;

    if (!fromCheckWeight)
      reject(
        `발송거부 유효하지 않은 폐기물량 : ${from.recycleWalletId} -> ${to.recycleWalletId} 
        ${ticker} : ${weight}`
      );

    const payload = { from, to, ticker, weight };
    const hashed = await dataHash(payload);
    // console.log({ ...payload, hashed });
    await RecycleLedger.create({ ...payload, hashed });

    const toRWM = new RecycleWalletManager(to);

    await fromRWM.saveRecycleWallet();
    await toRWM.saveRecycleWallet();

    const msg = `recycleWalletId: ${fromRWM.recycleWallet.recycleWalletId}가 recycleWalletId: ${toRWM.recycleWallet.recycleWalletId}에게 ${ticker}: ${weight}원을 송금하였습니다.`;
    const afterWeight = `${
      fromRWM.recycleWallet.recycleWalletId
    } : ${fromRWM.getBalane(ticker)},  ${
      toRWM.recycleWallet.recycleWalletId
    } : ${toRWM.getBalane(ticker)}`;

    resolve({ fromRWM, toRWM, ticker, weight, msg, afterWeight });
  });
};

module.exports = {
  createBotRecycleWallets,
  addwaste,
  createNewRecycleWallet,
  transferWaste,
  RecycleWalletManager,
};
