const axios = require("axios");
const { WebSocket } = require("ws");

const COIN_LIST = [
  "KRW-BTC",
  "KRW-ETH",
  "KRW-XRP",
  "KRW-ADA",
  "KRW-DOGE",
  "KRW-ATOM",
  "KRW-SOL",
  "KRW-ETC",
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
    this.ws = this.initSocket();
  }

  updatePrice = function (ticker, data) {
    console.log(data);
    this.price[ticker] = data;
  };

  updateOrderBook = function (ticker, data) {
    console.log(data);
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
      console.log("@@@@@@@connection");
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

module.exports = { CoinData, ChartData };
