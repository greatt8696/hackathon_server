require("dotenv").config();

require("./util/jsonUtil");

const express = require("express");

const bodyParser = require("body-parser");

const app = express();

const recycleRouter = require("./routers/recycle");

const SERVER_PORT = process.env.SERVER_PORT;

const { connectDb, initDb } = require("./mongoose");

const socketServer = require("./socket");

console.log("Socket init ");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use("/recycle", recycleRouter);

app.listen(3600, () => console.log("Running Server"));

connectDb().then(() => {
  initDb();
});
app.get("/user", async (req, res) => {
  res.send(user);
});

const { ChartData, CoinData } = require("./chartData");

const stringToJson = (e) => {
  console.log("@@@@@@@@",e);
  const enc = new TextDecoder("utf-8");
  const arr = new Uint8Array(e);
  const str_d = enc.decode(arr);
  console.log("@@@@@@@@",str_d);
  return JSON.parse(str_d);
};
const chartData = new ChartData();
chartData.initData();
// setTimeout(() => {
//   Object.values(chartData.candle).map((value) => console.log(value.length));
// }, 1000);

const coinData = new CoinData();
coinData.initSocket();

coinData.ws.on("message", function (e) {
  const data = stringToJson(e);
  console.log("@@@@@@@@@@@@", data);
  if (data.type === "ticker") {
    const {
      code,
      trade_price,
      change,
      change_rate,
      change_price,
      acc_trade_price_24h,
    } = data;
    const newData = {
      code,
      trade_price,
      change,
      change_rate,
      change_price,
      acc_trade_price_24h,
    };
    coinData.updatePrice(code, newData);
  }
  if (data.type === "orderbook") {
    const { code, orderbook_units, total_ask_size, total_bid_size } = data;
    const newData = {
      code,
      orderbook_units,
      total_ask_size,
      total_bid_size,
    };
    coinData.updateOrderBook(code, newData);
  }
});
