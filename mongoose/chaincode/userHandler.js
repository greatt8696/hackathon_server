const {
  Wallet,
  RecycleWorldTransactions,
  User,
  TechFund,
  GreenFund,
  RecycleLedger,
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
    const botUser = { userId, uid, role, name, pwd, walletId, email };
    return botUser;
  });
  return User.insertMany(userList);
};

module.exports = { createBotUsers };
