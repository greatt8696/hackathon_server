const bcrypt = require("bcrypt");

const REPEAT_NUM = 8;

const dataHash = function (inputDatas) {
  return new Promise((resolve, reject) => {
    const string = JSON.stringify(inputDatas);
    bcrypt.hash(string, 1, (err, hashedData) => {
      if (err) reject(err);
      resolve(hashedData);
    });
  });
};

const encrypt = function (pwd) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(pwd, REPEAT_NUM, (err, hashedPwd) => {
      if (err) reject(err);
      resolve(hashedPwd);
    });
  });
};

const compare = function (pwd, encrypted) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pwd, encrypted, (err, same) => {
      if (!err) resolve(same);
      reject(err);
    });
  });
};

module.exports = { encrypt, compare, dataHash };
