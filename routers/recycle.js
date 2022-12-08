const { candleData, coinData } = require("../chartData");
const { RecycleLedger } = require("../mongoose/models");
const { transferObjectID } = require("../mongoose/util");

const router = require("express").Router();

router.get("/getCharts", (req, res) => {
  const charts = candleData.getInitCandle();
  res.send(charts);
});

router.get("/getCoinsPrice", (req, res) => {
  const coinsPrice = coinData.getInitPrice();
  res.send();
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
  res.send({ resultFrom, resultTo });
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

  res.send({ test });
});

module.exports = router;
