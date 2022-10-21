const {
  Wallet,
  RecycleWorldTransactions,
  User,
  TechFund,
  GreenFund,
  RecycleLedger,
} = require("../models");

const constance = require("../constance/constance");
const { ConnectionStates } = require("mongoose");
const USER_ROLE = constance.UserRole;

const makeId = (idx) => `테스트용id${idx}`;
const makeUid = (idx) => `테스트용uid${idx}`;
const makeRole = () => USER_ROLE[parseInt(Math.random() * USER_ROLE.length)];
const makeName = (idx, role) => `${role}유저${idx}`;

const wallteId = (idx) => `지갑테스트용id${idx}`;
const recycleLedgerIds = (idx) => [`재활용장부테스트용${idx}`];

const randomCreateUser = (idx) => {
  const userId = makeId(idx);
  const uid = makeUid(idx);
  const role = makeRole(idx);
  const name = makeName(idx, role);
  const pwd = "$2b$08$SHqWBDxEgdvxRtSu0udOBuiog93YoctPuEJz9vksEycc5ttcsiJaq"; //123
  const randUser = { userId, uid, role, name, pwd, wallteId };
  User.createUser(randUser);
};
