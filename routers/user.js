const { candleData, coinData } = require("../chartData");
const { RecycleLedger, User, TransferLedger } = require("../mongoose/models");
const { transferObjectID } = require("../mongoose/util");
const { userData } = require("../userData");

const router = require("express").Router();

router.get("/getUsers", async (req, res) => {
  const users = userData.getAllUsers();
  console.log("/getUsers: send" + users.length);
  res.status(202).send(users);
});

router.get("/getUsers", async (req, res) => {
  const users = userData.getAllUsers();
  console.log("/getUsers: send" + users.length);
  res.status(202).send(users);
});



router.get("/getCoinsPrice", (req, res) => {
  const coinsPrice = coinData.getInitPrice();
  res.status(202).send(coinsPrice);
});

router.post("/getRecycleTransaction", async (req, res) => {
  const { fromId } = req.body;

  const from = RecycleLedger.find({
    "from.recycleWalletId": fromId,
  }).limit(500);
  const to = RecycleLedger.find({
    "to.recycleWalletId": fromId,
  }).limit(500);
  const [resultFrom, resultTo] = await Promise.all([from, to]);
  res.status(202).send({ resultFrom, resultTo });
});

router.post("/getTransferTransaction", async (req, res) => {
  const { fromId } = req.body;

  const from = TransferLedger.find({
    "from.walletId": fromId,
  }).limit(500);
  const to = TransferLedger.find({
    "to.walletId": fromId,
  }).limit(500);
  const [resultFrom, resultTo] = await Promise.all([from, to]);
  res.status(202).send({ resultFrom, resultTo });
});

router.post("/getRecycle1", async (req, res) => {
  const { fromId } = req.body;

  const test = await RecycleLedger.find({
    $or: [
      {
        "from.recycleWalletId": fromId,
      },
      {
        "to.recycleWalletId": fromId,
      },
    ],
  });

  res.status(202).send({ test });
});

module.exports = router;
