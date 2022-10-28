const axios = require("axios");
const { WebSocket } = require("ws");

const COIN_LIST = [
  "KRW-BTC",
  "KRW-ETH",
  "KRW-XRP",
  "KRW-ADA",
  "KRW-DOGE",
  "KRW-SOL",
];

const stringToJson = (e) => {
  const enc = new TextDecoder("utf-8");
  const arr = new Uint8Array(e);
  const str_d = enc.decode(arr);
  return JSON.parse(str_d);
};

class ChartData {
  constructor() {
    this.candle = {};
    this.list = [...COIN_LIST];
  }

  pushData = (ticker, data) => {
    this.candle[ticker] = data;
  };

  initData = async function () {
    this.list.forEach(async (ticker) => {
      setTimeout(async () => {
        this.candle[ticker] = await this.getCandleData(ticker, 5, 200);
      }, 500);
    });
  };

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
        .then((res) => resolve(res.data))
        .catch((err) => reject(err));
    });
  };
}

class CoinData {
  constructor() {
    this.price = {};
    this.orderBook = {};
    this.list = [...COIN_LIST];
    this.ws = false;
  }

  updatePrice = (ticker, data) => {
    this.price[ticker] = data;
  };

  updateOrderBook = function (ticker, data) {
    this.orderBook[ticker] = data;
  };

  initSocket = function () {
    this.ws = new WebSocket("wss://api.upbit.com/websocket/v1");

    this.ws.binaryType = "arraybuffer";

    this.ws.filterRequest = () => {
      const ticker = [...COIN_LIST];
      const addedKrwTicker = ticker.map((oneTicker) => `KRW-${oneTicker}`);
      const toJson = JSON.stringify(addedKrwTicker);
      const sendData = (toJson) =>
        `
      [ {"ticket":"UNIQUE_TICKET_ONE"},
        {"type":"ticker","codes": ${toJson}},
        {"type":"orderbook","codes":${toJson}}]`;

      if (this.ws === undefined) {
        alert("no connect exists");
        return;
      }
      this.ws.send(sendData(toJson));
    };

    this.ws.on("connection", function (e) {
      console.log("@@@@@@@connection");
      this.ws.filterRequest();
    });
    this.ws.on("close", (e) => {
      this.ws.filterRequest();
    });
    this.ws.on("open", (e) => {
      this.ws.filterRequest();
    });
    this.ws.on("message", function (e) {
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
        updatePrice(code, newData);
      }
      if (data.type === "orderbook") {
        const { code, orderbook_units, total_ask_size, total_bid_size } = data;
        const newData = {
          code,
          orderbook_units,
          total_ask_size,
          total_bid_size,
        };
        updateOrderBook(code, newData);
      }
    });
  };
}

module.exports = { CoinData, ChartData };
