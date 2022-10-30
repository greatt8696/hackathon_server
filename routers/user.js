const { candleData, coinData } = require("../chartData");
const { RecycleLedger, User } = require("../mongoose/models");
const { transferObjectID } = require("../mongoose/util");
const { userData } = require("../userData");

const router = require("express").Router();

router.get("/getUsers", async (req, res) => {
  const users = userData.getAllUsers();
  console.log("/getUsers: send"+users.length);
  res.status(202).send(users);
});

router.get("/getCoinsPrice", (req, res) => {
  const coinsPrice = coinData.getInitPrice();
  res.status(202).send(coinsPrice);
});

router.post("/getRecycle", async (req, res) => {
  const { fromId } = req.body;

  const from = RecycleLedger.find({
    "from.recycleWalletId": fromId,
  });
  const to = RecycleLedger.find({
    "to.recycleWalletId": fromId,
  });
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
