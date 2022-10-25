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
  makeCoin,
  createObjectId,
} = require("../util");
const { recyclesList } = require("../../recycleSimulation");

const createNewRecycleWallet = async (idx) => {
  const walletId = createObjectId();
  const coin = makeCoin();
  const newWallet = {
    walletId,
    coins: [coin],
  };
  await RecycleWallet.create(newWallet);
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

const addCoin = async (walletId, ticker) => {
  const tempId = walletId;
  const wallet = await RecycleWallet.findOne({ walletId: tempId });
  const oldcoinList = wallet.coins;
  const newCoin = makeCoin(ticker);
  const newCoins = [...oldcoinList, newCoin];
  console.log("addCoin", { ...wallet, coins: newCoins });
  const update = await RecycleWallet.replaceOne(
    { walletId: tempId },
    { coins: newCoins }
  );

  const result = await RecycleWallet.findOne({ walletId: tempId });
  console.log("addCoin", result);
};

module.exports = { createBotRecycleWallets, addCoin };
