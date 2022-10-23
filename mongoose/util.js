const constance = require("./constance/constance");
const {
  ConnectionStates,
  mongo: { ObjectId },
} = require("mongoose");

const userRoles = Object.values(constance.userRole).map(({ name }) => name) ;
const OBJECTID_TABLE = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  0,
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
];

const createObjectId = () => {
  const slot = new Array(24).fill("");
  return ObjectId(
    slot
      .map(
        () => OBJECTID_TABLE[parseInt(OBJECTID_TABLE.length * Math.random())]
      )
      .join("")
  );
};

const makeId = (idx) => `테스트용id${idx}`;
const makeUid = (idx) => `테스트용uid${idx}`;
const makeEmail = (idx) => `테스트${idx}@test.com`;



const makeRole = () => userRoles[parseInt(Math.random() * userRoles.length)]
const makeName = (idx, role) => `${role}유저${idx}`;
const makerecycleLedgerIds = (idx) => [`재활용장부테스트용${idx}`];

const makeBotObjectId = (idx) => {
  const digit = idx.toString().length;
  switch (digit) {
    case 1:
      return ObjectId(`00000000000000000000000${idx}`);

    case 2:
      return ObjectId(`0000000000000000000000${idx}`);

    case 3:
      return ObjectId(`000000000000000000000${idx}`);

    case 4:
      return ObjectId(`00000000000000000000${idx}`);

    case 5:
      return ObjectId(`0000000000000000000${idx}`);

    default:
      return ObjectId(`00000000000000000000000${"a"}`);
  }
};

const makeCoin = (inputObj) => {
  const defaultInput = { ticker: "GREEN", name: "그린코인", balance: 0 };
  return { ...defaultInput, ...inputObj, balance: inputObj.balance.toFixed(3) };
};

module.exports = {
  makeId,
  makeUid,
  makeEmail,
  makeRole,
  makeName,
  makerecycleLedgerIds,
  makeBotObjectId,
  makeCoin,
  createObjectId,
};
