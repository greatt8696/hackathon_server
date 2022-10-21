const {
  Wallet,
  RecycleWorldTransactions,
  User,
  TechFund,
  GreenFund,
  RecycleLedger,
} = require("../models");

const constance = require("../constance/constance");
const USER_ROLE = constance.userRole;
const {
  ConnectionStates,
  mongo: { ObjectId },
} = require("mongoose");
const { removeDep } = require("../../util/jsonUtil");

const makeId = (idx) => ObjectId();
const makeCoin = (ticker = "GREEN", name = "그린코인", balance = 0) => {
  return { ticker, name, balance };
};

const createNewWallet = (idx) => {
  const walletId = makeId();
  const coin = makeCoin();
  const newWallet = {
    walletId,
    coins: [coin],
  };
  Wallet.create(newWallet);
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

module.exports = { createNewWallet, addCoin };
