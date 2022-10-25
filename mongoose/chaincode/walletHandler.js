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

const createNewWallet = (idx) => {
  const walletId = makeId();
  const coin = makeCoin();
  const newWallet = {
    walletId,
    coins: [coin],
  };
  Wallet.create(newWallet);
};
const createBotWallets = (awalletSize) => {
  const idxList = Array(awalletSize)
    .fill(false)
    .map((_, idx) => idx);

  const newwallets = idxList.map((idx) => {
    const walletId = makeBotObjectId(idx);
    const coin = makeCoin({ balance: 100000000 * Math.random() + 100000 });
    return {
      walletId,
      coins: [coin],
    };
  });
  return Wallet.insertMany(newwallets);
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

module.exports = { createBotWallets };
