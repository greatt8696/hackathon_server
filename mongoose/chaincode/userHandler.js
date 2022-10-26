const {
  Wallet,
  RecycleWorldTransactions,
  User,
  TechFund,
  GreenFund,
  RecycleLedger,
  RecycleWallet,
} = require("../models");

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
const { WalletManager } = require("./coinHandler");
const { RecycleWalletManager } = require("./recycleWalletHandler");

class UserManager {
  constructor(user) {
    if (!user) throw new Error("해당 ID의 지갑을 찾지 못하였습니다.");
    this.user = user.immer();
  }

  getWallet = async function () {
    const result = await Wallet.findOne({ walletId: this.user.walletId });
    return new WalletManager(result);
  };

  getRecyleWallet = async function () {
    const result = await RecycleWallet.findOne({
      recycleWalletId: this.user.recycleWalletId,
    });
    return new RecycleWalletManager(result);
  };
}

const createBotUser = async (idx) => {
  const userId = makeId(idx);
  const uid = makeUid(idx);
  const role = makeRole(idx);
  const email = makeEmail(idx);
  const name = makeName(idx, role);
  const pwd = "$2b$08$SHqWBDxEgdvxRtSu0udOBuiog93YoctPuEJz9vksEycc5ttcsiJaq"; //123
  const walletId = makeBotObjectId(idx);
  const botUser = { userId, uid, role, name, pwd, walletId, email };
  return User.createUser(botUser);
};

const createBotUsers = async (userSize) => {
  const idxList = Array(userSize)
    .fill(false)
    .map((_, idx) => idx);

  const userList = idxList.map((idx) => {
    const userId = makeId(idx);
    const uid = makeUid(idx);
    const role = makeRole();
    const email = makeEmail(idx);
    const name = makeName(idx, role);
    const pwd = "$2b$08$SHqWBDxEgdvxRtSu0udOBuiog93YoctPuEJz9vksEycc5ttcsiJaq"; //123
    const walletId = makeBotObjectId(idx);
    const recycleWalletId = makeBotObjectId(idx);
    const botUser = {
      userId,
      uid,
      role,
      name,
      pwd,
      walletId,
      email,
      recycleWalletId,
    };
    return botUser;
  });
  return User.insertMany(userList);
};

module.exports = { createBotUsers, UserManager };
