const axios = require("axios");
const { WebSocket } = require("ws");
const { tradeSocket } = require("../socket");

const COIN_LIST = [
  "KRW-BTC",
  "KRW-ETH",
  "KRW-XRP",
  "KRW-ADA",
  "KRW-DOGE",
  "KRW-ATOM",
  "KRW-SOL",
  "KRW-ETC",
  "KRW-MATIC",
];

class CandleData {
  constructor() {
    this.candle = {};
    this.list = [...COIN_LIST];
    this.initData();
  }

  pushData = (ticker, data) => {
    this.candle[ticker] = data;
  };

  initData = async function () {
    await this.list.forEach(async (ticker) => {
      setTimeout(async () => {
        const { data, token } = await this.getCandleData(ticker, 5, 80);
        const ohlc = [];
        const volume = [];
        data.forEach(
          ({
            opening_price,
            high_price,
            low_price,
            trade_price,
            timestamp,
            candle_acc_trade_price,
          }) => {
            ohlc.push({
              x: timestamp,
              y: [opening_price, high_price, low_price, trade_price],
            });
            volume.push({
              x: timestamp,
              y: candle_acc_trade_price,
            });
          }
        );
        this.candle[token] = { ohlc, volume };
      }, 500);
    });
  };

  updateOneCandle = async function () {
    await this.list.forEach(async (ticker) => {
      setTimeout(async () => {
        const { data, token } = await this.getCandleData(ticker, 5, 2);
        const ohlc = [];
        const volume = [];
        data.forEach(
          ({
            opening_price,
            high_price,
            low_price,
            trade_price,
            timestamp,
            candle_acc_trade_price,
          }) => {
            ohlc.push({
              x: timestamp,
              y: [opening_price, high_price, low_price, trade_price],
            });
            volume.push({
              x: timestamp,
              y: candle_acc_trade_price,
            });
          }
        );
        console.log(data);
        this.candle[token] = { ohlc, volume };
      }, 500);
    });
  };

  getInitCandle = () => this.candle;

  getCandleData = async function (
    token = "KRW-BTC",
    minutes = "5",
    count = 200
  ) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          `https://api.upbit.com/v1/candles/minutes/${minutes}?market=` +
            `${token}` +
            `&count=${count}`
        )
        .then((res) => resolve({ data: res.data, token }))
        .catch((err) => reject(err));
    });
  };
}

class CoinData {
  constructor() {
    this.price = {};
    this.orderBook = {};
    this.list = [...COIN_LIST];
    this.ws = this.initSocket();
  }

  getInitPrice = () => this.price;

  updatePrice = function (ticker, data) {
    this.price[ticker] = data;
  };

  updateOrderBook = function (ticker, data) {
    this.orderBook[ticker] = data;
  };

  initSocket = function () {
    const ws = new WebSocket("wss://api.upbit.com/websocket/v1");

    ws.binaryType = "arraybuffer";

    const filterRequest = function () {
      const ticker = [...COIN_LIST];
      const addedKrwTicker = ticker.map((oneTicker) => `${oneTicker}`);
      const toJson = JSON.stringify(addedKrwTicker);
      const sendData = (toJson) =>
        `
    [ {"ticket":"UNIQUE_TICKET_ONE"},
      {"type":"ticker","codes": ${toJson}},
      {"type":"orderbook","codes":${toJson}}]`;

      if (ws === undefined) {
        alert("no connect exists");
        return;
      }
      ws.send(sendData(toJson));
    };

    ws.on("connection", function (e) {
      filterRequest();
    });

    ws.on("close", function (e) {
      filterRequest();
    });

    ws.on("open", function (e) {
      filterRequest();
    });
    return ws;
  };
}

const stringToJson = (e) => {
  const enc = new TextDecoder("utf-8");
  const arr = new Uint8Array(e);
  const str_d = enc.decode(arr);
  return JSON.parse(str_d);
};
const candleData = new CandleData();

const coinData = new CoinData();
coinData.initSocket();

coinData.ws.on("message", function (e) {
  const data = stringToJson(e);
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
    tradeSocket.emit("price", newData);
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
    tradeSocket.emit("order", newData);
  }
});

setInterval(() => {
  tradeSocket.emit("candle", candleData.candle);
}, 100);

module.exports = { coinData, candleData };
