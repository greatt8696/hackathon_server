// const greenFund = [
//   {
//     greenFundId: "그린펀드1",
//     state: "펀딩중", // 검토, 펀딩중, 펀딩완료, 사업진행중
//     name: "양천구 공원참나무심기 #12",
//     organizer: "테스트용uid1",
//     basePoint: { lat: 11.111, lng: 11.111 },
//     section: { type: "svg", path: "" },
//     treeType: "참나무",
//     age: { avr: 15, min: 12, max: 18, unit: "year" }, // 년
//     height: { avr: 5, min: 4, max: 6, unit: "meter" }, // 미터
//     createdAt: "2022.11.11",
//     endDate: "2023.12.11",
//     targetAmount: 150000,
//     currAmount: 150000,
//     fundHistories: [{ userId: "테스트용uid1", coin: "green", amount: 150000 }],
//   },
//   {
//     greenFundId: "그린펀드2",
//     name: "천호 공원은행나무심기 #33",
//     state: "펀딩중", // 검토, 펀딩중, 펀딩완료, 사업진행중
//     organizer: "테스트용uid2",
//     basePoint: { lat: 22.2222, lng: 22.2222 },
//     section: { type: "svg", path: "" },
//     treeType: "은행나무",
//     age: { avr: 15, min: 12, max: 18, unit: "year" }, // 년
//     height: { avr: 5, min: 4, max: 6, unit: "meter" }, // 미터
//     createdAt: "2022.10.18",
//     endDate: "2022.12.18",
//     targetAmount: 2200000,
//     currAmount: 500000,
//     fundHistories: [
//       { userId: "테스트용uid2", coin: "green", amount: 200000 },
//       { userId: "테스트용uid3", coin: "green", amount: 100000 },
//       { userId: "테스트용uid4", coin: "green", amount: 200000 },
//     ],
//   },
// ];
const axios = require("axios");
// const { Web } = require("ws");

// const techFund = [
//   {
//     techFundId: "테크펀드id1",
//     name: "플라스틱 유전 #12",
//     state: "펀딩중", // 검토, 펀딩중, 펀딩완료, 사업진행중
//     organizer: "테스트용uid1",
//     basePoint: { lat: 11.111, lng: 11.111 },
//     techType: "가공", // 가공, 처리,
//     rationales: [
//       { type: "url", name: "근거이론1", content: "https://naver.com" },
//     ],
//     mileStone: [
//       {
//         Title: "달성목표11",
//         content: "달성목표내용11",
//         targetDate: "2022.11.11",
//       },
//       {
//         Title: "달성목표12",
//         content: "달성목표내용12",
//         targetDate: "2023.05.22",
//       },
//       {
//         Title: "달성목표13",
//         content: "달성목표내용13",
//         targetDate: "2023.12.11",
//       },
//     ],
//     createdAt: "2022.11.11",
//     endDate: "2023.12.11",
//     targetAmount: 150000,
//     currAmount: 100000,
//     fundHistories: [{ userId: "테스트용uid1", coin: "green", amount: 100000 }],
//   },
//   {
//     techFundId: "테크펀드id2",
//     name: "플라스틱벽돌 #12",
//     state: "펀딩완료", // 검토, 펀딩중, 펀딩완료, 사업진행중
//     organizer: "테스트용uid2",
//     basePoint: { lat: 11.111, lng: 11.111 },
//     techType: "제품", // 가공, 처리, 제품
//     rationales: [
//       { type: "url", name: "근거이론2", content: "https://naver.com" },
//     ],
//     mileStones: [
//       {
//         Title: "달성목표21",
//         content: "달성목표내용21",
//         targetDate: "2022.11.11",
//       },
//       {
//         Title: "달성목표22",
//         content: "달성목표내용22",
//         targetDate: "2023.05.22",
//       },
//       {
//         Title: "달성목표23",
//         content: "달성목표내용23",
//         targetDate: "2023.12.11",
//       },
//     ],
//     createdAt: "2022.11.11",
//     endDate: "2023.12.11",
//     targetAmount: 220000,
//     currAmount: 220000,
//     fundHistories: [{ userId: "테스트용uid2", coin: "green", amount: 220000 }],
//   },
// ];
// const maps = [
//   [
//     { lat: 35.17090347158561, lng: 126.74808112312965 },
//     { lat: 37.8772613472204, lng: 128.71249304834552 },
//   ], //37.353703141353975, 129.22885358155085 ~ 35.2950477155348, 128.74324493240002
//   [
//     { lat: 35.2950477155348, lng: 128.74324493240002 },
//     { lat: 37.353703141353975, lng: 129.22885358155085 },
//   ],
//   [
//     //38.33411684402681, 127.12714382175554 ~ 37.97519195698241, 128.4084972405555
//     { lat: 37.97519195698241, lng: 127.12714382175554 },
//     { lat: 38.33411684402681, lng: 128.4084972405555 },
//   ],
// ];

// const mapsData = maps.map((map) => {
//   const height = map[1].lat - map[0].lat;
//   const width = map[1].lng - map[0].lng;
//   const size = width * height;
//   const range = { lat: Math.random() };
//   return { width, height, size, basePoint: { ...map[0] } };
// });

const { WebSocket } = require("ws");

// axios
//   .get(
//     "https://api.upbit.com/v1/candles/minutes/60?market=" +
//       "KRW-BTC" +
//       "&count=10"
//   )
//   .then((res) => {
//     console.log(res.data);
//   })
//   .catch((err) => console.error(err));

const stringToJson = (e) => {
  const enc = new TextDecoder("utf-8");
  const arr = new Uint8Array(e);
  const str_d = enc.decode(arr);
  return JSON.parse(str_d);
};

const ws = new WebSocket("wss://api.upbit.com/websocket/v1");

ws.binaryType = "arraybuffer";

ws.filterRequest = () => {
  const ticker = [
    "BTC",
    "ETH",
    "XRP",
    "ADA",
    "DOGE",
    "GRS",
    "POLY",
    "ETC",
    "HUNT",
    "CHZ",
    "WEMIX",
    "HIVE",
    "ALGO",
    "ATOM",
    "PUNDIX",
    "SOL",
    "SAND",
    "MATIC",
    "LINK",
    "TRX",
    "BCH",
    "WAVES",
    "XEC",
    "AXS",
    "MANA",
    "REP",
    "NEAR",
    "FLOW",
    "MBL",
    "KNC",
    "PLA",
    "EOS",
    "XLM",
    "ZIL",
    "BTG",
    "KAVA",
    "STEEM",
    "MFT",
    "QKC",
    "DOT",
    "GLM",
    "XEM",
    "LOOM",
    "BORA",
    "SXP",
    "NEO",
    "AERGO",
    "STX",
    "VET",
    "HBAR",
    "WAXP",
    "JST",
    "UPP",
    "GMT",
    "AVAX",
    "ANKR",
    "NU",
    "SRM",
    "ORBS",
    "STORJ",
    "STPT",
    "HUM",
    "TFUEL",
    "AAVE",
    "MTL",
    "ARK",
    "POWR",
    "BSV",
    "STRAX",
    "STMX",
    "CVC",
    "RFR",
    "THETA",
    "ENJ",
    "ONG",
    "IOTA",
    "SNT",
    "T",
    "TT",
    "GAS",
    "ZRX",
    "ELF",
    "MED",
    "XTZ",
    "LSK",
    "BTT",
    "AQT",
    "SSX",
    "DAWN",
    "SBD",
    "ARDR",
    "DKA",
    "ARDR",
    "DKA",
    "MOC",
    "MLK",
    "ONT",
    "CELO",
    "OMG",
    "CBK",
    "SC",
    "ICX",
    "IQ",
    "BAT",
    "META",
    "TON",
    "IOST",
  ];
  const addedKrwTicker = ticker.map((oneTicker) => `KRW-${oneTicker}`);
  const toJson = JSON.stringify(addedKrwTicker);
  const sendData = (toJson) =>
    `
      [ {"ticket":"UNIQUE_TICKET_ONE"},
        {"type":"ticker","codes": ${toJson}},
        {"type":"orderbook","codes":${toJson}}]`;
  // `
  //   [{"ticket":"UNIQUE_TICKET"},
  //   {"type":"ticker","codes": ${toJson}},
  //     {"type":"orderbook","codes":${toJson}},
  //     {"type":"trade","codes": ${toJson}}]`;

  if (ws === undefined) {
    alert("no connect exists");
    return;
  }
  console.log(sendData(toJson));
  ws.send(sendData(toJson));
};

ws.on("connection", function (e) {
  console.log("@@@@@@@connection");
  ws.filterRequest();
});
ws.on("close", (e) => {
  ws.filterRequest();
});
ws.on("open", (e) => {
  ws.filterRequest();
});

ws.on("message", function (e) {
  // console.log("message@@", e);
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
    console.log(newData);
  }
  if (data.type === "orderbook") {
    const { code, orderbook_units, total_ask_size, total_bid_size } = data;
    const newData = {
      code,
      orderbook_units,
      total_ask_size,
      total_bid_size,
    };
    console.log(newData);
  }
});
