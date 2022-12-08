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

const CANDLE_SIZE = 80;
const MINUTE = 15;

class CandleData {
  constructor() {
    this.candle = {};
    this.list = [...COIN_LIST];
    this.initData();
    this.lastCandleTime = "";
  }

  pushData = (ticker, data) => {
    this.candle[ticker] = data;
  };

  initData = async function () {
    await this.list.forEach(async (ticker) => {
      setTimeout(async () => {
        const { data, token } = await this.getCandleData(
          ticker,
          MINUTE,
          CANDLE_SIZE
        );
        let temp = "";
        const ohlc = [];
        const volume = [];
        data.forEach(
          (
            {
              opening_price,
              high_price,
              low_price,
              trade_price,
              candle_acc_trade_price,
              candle_date_time_kst,
            },
            idx
          ) => {
            if (idx === 0) temp = new Date(candle_date_time_kst);
            ohlc.push({
              x: new Date(candle_date_time_kst),
              y: [opening_price, high_price, low_price, trade_price],
            });
            volume.push({
              x: new Date(candle_date_time_kst),
              y: candle_acc_trade_price,
            });
          }
        );
        this.candle[token] = { ohlc, volume };
        this.lastCandle = temp;
      }, 500);
    });
  };

  updateOneCandle = async function () {
    await this.list.forEach(async (ticker) => {
      try {
        setTimeout(async () => {
          const { data, token } = await this.getCandleData(ticker, MINUTE, 1);
          const ohlc = [];
          const volume = [];
          let temp = "";
          data.forEach(
            ({
              opening_price,
              high_price,
              low_price,
              trade_price,
              candle_acc_trade_price,
              candle_date_time_kst,
            }) => {
              if (this.lastCandleTime !== candle_date_time_kst) {
                ohlc.push({
                  x: new Date(candle_date_time_kst),
                  y: [opening_price, high_price, low_price, trade_price],
                });
                volume.push({
                  x: new Date(candle_date_time_kst),
                  y: candle_acc_trade_price,
                });
                this.candle[token].ohlc.pop();
                this.candle[token].volume.pop();
              }
              temp = candle_date_time_kst;
            }
          );
          this.lastCandleTime = temp;
          this.candle[token] = {
            ohlc: [...ohlc, ...this.candle[token].ohlc],
            volume: [...volume, ...this.candle[token].volume],
          };
        }, 1200);
      } catch (error) {
        console.error(error);
      }
    });
  };

  getInitCandle = () => this.candle;

  getCandleData = async function (
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
const coinData = new CoinData();
coinData.initSocket();

const candleData = new CandleData();

coinData.ws.on("message", function (e) {
  const data = stringToJson(e);
  let lastPrice = 0;
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

    if (lastPrice !== trade_price) {
      coinData.updatePrice(code, newData);
      tradeSocket.emit("price", newData);
      //console.log("@@@",coinData.price);
      tradeSocket.emit(
        "recyclePrice",
        getRecyclePrice(coinData.getInitPrice())
      );
    }

    if (candleData.candle[code] !== undefined) {
      const newOhlc = candleData.candle[code]?.ohlc;
      if (newOhlc[0].x - newOhlc[1].x > 40000) {
        const delOhlc = newOhlc.shift();
        delOhlc.y[3] = trade_price;
        if (delOhlc.y[1] < trade_price) delOhlc.y[1] = trade_price;
        else if (delOhlc.y[2] > trade_price) delOhlc.y[2] = trade_price;
        const ohlc = [{ ...delOhlc, y: delOhlc.y }, ...newOhlc];
        candleData.candle[code] = { ...candleData.candle[code], ohlc };
      } else {
        const delOhlc = newOhlc[0];
        delOhlc.y[3] = trade_price;
        if (delOhlc.y[1] < trade_price) delOhlc.y[1] = trade_price;
        else if (delOhlc.y[2] > trade_price) delOhlc.y[2] = trade_price;
        const ohlc = [...newOhlc];
        candleData.candle[code] = { ...candleData.candle[code], ohlc };
      }
      tradeSocket.emit("candle", { [code]: candleData.candle[code] });
    }
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

setInterval(async () => {
  await candleData.updateOneCandle();
  tradeSocket.emit("candle", candleData.candle);
  console.log(candleData.candle["KRW-BTC"].volume.length);
}, 12000);

console.log(coinData.getInitPrice());

const getRecyclePrice = (input) => {
  const EXCHANGE = {
    서울거래소: "EXC_SEOUL",
    인천거래소: "EXC_INCHEON",
    세종거래소: "EXC_SEJONG",
    대전거래소: "EXC_DAEJEON",
    강원거래소: "EXC_GANGWON",
    광주거래소: "EXC_GWANGJU",
    부산거래소: "EXC_BUSAN",
    울산거래소: "EXC_ULSAN",
    대구거래소: "EXC_DAEGU",
  };
  const exchange = Object.keys(EXCHANGE);

  const random = Object.keys(input).map((key) => input[key].change_rate);
  const basedDatas = [
    {
      ticker: "PAPE_NEWS",
      data: [136, 0.0, -6.6, 11.0, 0.7, 6.6, -4.4, -2.2, 1.2],
    },
    {
      ticker: "PAPE_BOAD",
      data: [97, 1.0, -9.3, -18.6, -22.7, -9.3, -13.4, -17.5, 2.2],
    },
    { ticker: "FLAK_PE", data: [694, 1.7, 3.7, -2.9, 2.9, 2.0, 4.2, 3.6, 5.5] },
    {
      ticker: "PELL_PE",
      data: [850, -4.7, 2.2, -2.0, -12.6, 6.7, -0.6, -2.5, 1.2],
    },
    {
      ticker: "EPS_ING",
      data: [903, 20.8, 11.6, 13.4, 18.6, 14.0, 4.1, 8.0, 6.8],
    },
    {
      ticker: "COMP_PE",
      data: [484, 4.1, -7.2, 2.1, 1.0, -7.6, -12.6, -8.9, 5],
    },
    {
      ticker: "GLSSB_CULLET_BROWN",
      data: [42, 38.1, 38.1, 7.1, -4.8, -19.0, -2.4],
    },
    {
      ticker: "MTAL_ALCAN",
      data: [1339, -6.0, -4.6, -2.2, -4.7, -8.4, -5.8, -2.8],
    },
    { ticker: "TIRE_POWD", data: [250, -4.0, 8.0, 4.4] },
  ];
  const result = {};
  basedDatas.map((_, idx) => {
    result[exchange[idx]] = [];
  });
  basedDatas.map((val, idx) => {
    exchange.forEach((_, idx) => {
      if (idx !== 0) {
        if (val.data[idx] !== undefined)
          result[exchange[idx]].push({
            ticker: val.ticker,
            data: parseInt(val.data[0] + val.data[idx] * (1 + 6 * random[idx])),
          });
      } else {
        if (val.data[idx] !== undefined)
          result[exchange[idx]].push({
            ticker: val.ticker,
            data: parseInt(val.data[0] * (1 + 6 * random[0])),
          });
      }
    });
  });

  return result;
};

//const basedDatas = [
//{ ticker: "PAPE_NEWS", data: [136, 0.0, -6.6, 11.0, 0.7, 6.6, -4.4, -2.2] },
//{ ticker: "PAPE_BOAD",  data: [97, 1.0, -9.3, -18.6, -22.7, -9.3, -13.4, -17.5], },
//{ ticker: "FLAK_PE", data: [694, 1.7, 3.7, -2.9, 2.9, 2.0, 4.2, 3.6] },
//{ ticker: "FLAK_PP", data: [604, -6.8, -12.1, -0.8, -1.7, -4.3, 1.0, -7.8] },
//{ ticker: "PELL_PE", data: [850, -4.7, 2.2, -2.0, -12.6, 6.7, -0.6, -2.5] },
//{ ticker: "PELL_PP", data: [752, -1.7, 2.8, -1.9, -2.9, -0.5, -1.3, -2.5] },
//{ ticker: "EPS_ING", data: [903, 20.8, 11.6, 13.4, 18.6, 14.0, 4.1, 8.0] },
//{ ticker: "COMP_PET", data: [439, 7.1, 3.0, 0.9, 7.7, -2.5, -19.6, -1.8] },
//{ ticker: "COMP_PE", data: [484, 4.1, -7.2, 2.1, 1.0, -7.6, -12.6, -8.9] },
//{ ticker: "COMP_PP", data: [437, 4.6, -10.8, 1.6, 30.9, -10.8, -9.6, -10.5] },
//{ ticker: "GLSSB_CULLET_WHITE", data: [71, 28.2, 11.3, 1.4, -1.4, -4.2, -18.3, 21.1], },
//{ ticker: "GLSSB_CULLET_BROWN", data: [42, 38.1, 38.1, 7.1, -4.8, -19.0, -2.4], },
//{ ticker: "GLSSB_CULLET_GREEN", data: [29, 31.0, 20.7, 17.2, 10.3, 3.4, 17.2], },
//{ ticker: "MTAL_SCRP", data: [368, 0.8, 3.0, 2.7, 4.9, -14.9, 0.3, 13.6] },
//{ ticker: "MTAL_CAN", data: [282, 2.1, -2.8, 9.6, 0.7, -16.3, 6.4, 1.1] },
//{ ticker: "MTAL_ALCAN", data: [1339, -6.0, -4.6, -2.2, -4.7, -8.4, -5.8, -2.8],},
//{ ticker: "TIRE_POWD", data: [250, -4.0, 8.0, 4.4] },
//];

// const randoms = Object.keys(EXCHANGE).map((key, idx) => {
//   randomDatas[key].data = basedDatas[idx];
// });

// console.log(randomDatas);

module.exports = { coinData, candleData };
