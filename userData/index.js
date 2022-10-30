const axios = require("axios");
const { WebSocket } = require("ws");
const { User } = require("../mongoose/models");
const { tradeSocket } = require("../socket");

class UserData {
  constructor() {
    this.allUsers = {};
  }

  pushData = (ticker, data) => {
    this.candle[ticker] = data;
  };

  initAllUsers = async function () {
    const allUsers = await User.findAll();
    console.log("initAllUsers",allUsers.length);
    this.allUsers = allUsers;
  };

  getAllUsers = () => this.allUsers;

  getInitCandle = () => this.candle;

  getuserDatas = async function (
    token = "KRW-BTC",
    minutes = MINUTE,
    count = 200
  ) {
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(
            `https://api.upbit.com/v1/candles/minutes/${minutes}?market=` +
              `${token}` +
              `&count=${count}`
          )
          .then((res) => resolve({ data: res.data, token }))
          .catch((err) => reject(err));
      } catch (error) {
        console.error(error);
      }
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
const userData = new UserData();

userData.initAllUsers();

// const coinData = new CoinData();
// coinData.initSocket();

// coinData.ws.on("message", function (e) {
//   const data = stringToJson(e);
//   let lastPrice = 0;
//   if (data.type === "ticker") {
//     const {
//       code,
//       trade_price,
//       change,
//       change_rate,
//       change_price,
//       acc_trade_price_24h,
//     } = data;
//     const newData = {
//       code,
//       trade_price,
//       change,
//       change_rate,
//       change_price,
//       acc_trade_price_24h,
//     };

//     if (lastPrice !== trade_price) {
//       coinData.updatePrice(code, newData);
//       tradeSocket.emit("price", newData);
//     }

//     if (userDatas.candle[code] !== undefined) {
//       const newOhlc = userDatas.candle[code]?.ohlc;
//       if (newOhlc[0].x - newOhlc[1].x > 40000) {
//         const delOhlc = newOhlc.shift();
//         delOhlc.y[3] = trade_price;
//         if (delOhlc.y[1] < trade_price) delOhlc.y[1] = trade_price;
//         else if (delOhlc.y[2] > trade_price) delOhlc.y[2] = trade_price;
//         const ohlc = [{ ...delOhlc, y: delOhlc.y }, ...newOhlc];
//         userDatas.candle[code] = { ...userDatas.candle[code], ohlc };
//       } else {
//         const delOhlc = newOhlc[0];
//         delOhlc.y[3] = trade_price;
//         if (delOhlc.y[1] < trade_price) delOhlc.y[1] = trade_price;
//         else if (delOhlc.y[2] > trade_price) delOhlc.y[2] = trade_price;
//         const ohlc = [...newOhlc];
//         userDatas.candle[code] = { ...userDatas.candle[code], ohlc };
//       }
//       tradeSocket.emit("candle", { [code]: userDatas.candle[code] });
//     }
//   }
//   if (data.type === "orderbook") {
//     const { code, orderbook_units, total_ask_size, total_bid_size } = data;
//     const newData = {
//       code,
//       orderbook_units,
//       total_ask_size,
//       total_bid_size,
//     };
//     coinData.updateOrderBook(code, newData);
//     tradeSocket.emit("order", newData);
//   }
// });

// setInterval(async () => {
//   await userDatas.updateOneCandle();
//   tradeSocket.emit("candle", userDatas.candle);
//   console.log(userDatas.candle["KRW-BTC"].volume.length);
// }, 12000);

module.exports = { userData };
