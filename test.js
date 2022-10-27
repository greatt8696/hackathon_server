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

// function upbitSocket() {
//   const socket = new WebSocket("wss://api.upbit.com/websocket/v1");
//   socket.binaryType = "arraybuffer";

//   // if (socket !== undefined) {
//   //   socket.close();
//   // }

//   socket.filterRequest = () => {
//     const ticker = [
//       "BTC",
//       "ETH",
//       "XRP",
//       "ADA",
//       "DOGE",
//       "GRS",
//       "POLY",
//       "ETC",
//       "HUNT",
//       "CHZ",
//       "WEMIX",
//       "HIVE",
//       "ALGO",
//       "ATOM",
//       "PUNDIX",
//       "SOL",
//       "SAND",
//       "MATIC",
//       "LINK",
//       "TRX",
//       "BCH",
//       "WAVES",
//       "XEC",
//       "AXS",
//       "MANA",
//       "REP",
//       "NEAR",
//       "FLOW",
//       "MBL",
//       "KNC",
//       "PLA",
//       "EOS",
//       "XLM",
//       "ZIL",
//       "BTG",
//       "KAVA",
//       "STEEM",
//       "MFT",
//       "QKC",
//       "DOT",
//       "GLM",
//       "XEM",
//       "LOOM",
//       "BORA",
//       "SXP",
//       "NEO",
//       "AERGO",
//       "STX",
//       "VET",
//       "HBAR",
//       "WAXP",
//       "JST",
//       "UPP",
//       "GMT",
//       "AVAX",
//       "ANKR",
//       "NU",
//       "SRM",
//       "ORBS",
//       "STORJ",
//       "STPT",
//       "HUM",
//       "TFUEL",
//       "AAVE",
//       "MTL",
//       "ARK",
//       "POWR",
//       "BSV",
//       "STRAX",
//       "STMX",
//       "CVC",
//       "RFR",
//       "THETA",
//       "ENJ",
//       "ONG",
//       "IOTA",
//       "SNT",
//       "T",
//       "TT",
//       "GAS",
//       "ZRX",
//       "ELF",
//       "MED",
//       "XTZ",
//       "LSK",
//       "BTT",
//       "AQT",
//       "SSX",
//       "DAWN",
//       "SBD",
//       "ARDR",
//       "DKA",
//       "ARDR",
//       "DKA",
//       "MOC",
//       "MLK",
//       "ONT",
//       "CELO",
//       "OMG",
//       "CBK",
//       "SC",
//       "ICX",
//       "IQ",
//       "BAT",
//       "META",
//       "TON",
//       "IOST",
//     ];
//     const addedKrwTicker = ticker.map((oneTicker) => `KRW-${oneTicker}`);
//     const toJson = JSON.stringify(addedKrwTicker);
//     const sendData = (toJson) =>
//       `
//         [ {"ticket":"UNIQUE_TICKET"},
//           {"type":"ticker","codes": ${toJson}},
//           {"type":"orderbook","codes":${toJson}}]`;
//     // `
//     //   [{"ticket":"UNIQUE_TICKET"},
//     //   {"type":"ticker","codes": ${toJson}},
//     //     {"type":"orderbook","codes":${toJson}},
//     //     {"type":"trade","codes": ${toJson}}]`;

//     if (socket === undefined) {
//       alert("no connect exists");
//       return;
//     }
//     socket.send(sendData(toJson));
//   };
//   socket.stringToJson = (e) => {
//     const enc = new TextDecoder("utf-8");
//     const arr = new Uint8Array(e.data);
//     const str_d = enc.decode(arr);
//     return JSON.parse(str_d);
//   };
//   socket.closeWS = () => {
//     if (socket !== undefined) {
//       socket.close();
//     }
//   };
//   socket.onopen = (e) => {
//     socket.filterRequest();
//   };
//   return socket;
// }

const options = { method: "GET", headers: { accept: "application/json" } };

axios
  .get(
    "https://api.upbit.com/v1/candles/minutes/60?market=" +
      "KRW-BTC" +
      "&count=10"
  )
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => console.error(err));

const coinList = {
  greencoin: {
    name: "그린코인",
    ticker: "GREEN",
  },

  esgPoint: {
    name: "ESG포인트",
    ticker: "ESG",
  },

  paper: {
    name: "폐지",
    ticker: "PAPE",
    sub: {
      news: { name: "폐지", ticker: "PAPE_NEWS" },
      cardboard: { name: "골판지", ticker: "PAPE_BOAD" },
    },
  },
  flake: {
    name: "플레이크",
    ticker: "FLAK",
    sub: {
      pe: { name: "플레이크-PE", ticker: "FLAK_PE" },
      pp: { name: "플레이크-PP", ticker: "FLAK_PP" },
      ps: { name: "플레이크-PS", ticker: "FLAK_PS" },
      pvc: { name: "플레이크-PVC", ticker: "FLAK_PVC" },
      abs: { name: "플레이크-ABS", ticker: "FLAK_ABS" },
    },
  },
  pellet: {
    name: "펠렛",
    ticker: "PELL",
    sub: {
      pp: { name: "펠렛-PP", ticker: "PELL_PP" },
      ps: { name: "펠렛-PS", ticker: "PELL_PS" },
      pvc: { name: "펠렛-PVC", ticker: "PELL_PVC" },
      abs: { name: "펠렛-ABS", ticker: "PELL_ABS" },
    },
  },
  compress: {
    name: "압축",
    ticker: "COMP",
    sub: {
      pe: { name: "압축-PE", ticker: "COMP_PE" },
      pp: { name: "압축-PP", ticker: "COMP_PP" },
      pet: { name: "압축-PET", ticker: "COMP_PET" },
    },
  },
  glassBottle: {
    name: "폐유리병",
    ticker: "GLSSB",
    sub: {
      white: { name: "백색", ticker: "GLSSB_WHITE" },
      brown: { name: "갈색", ticker: "GLSSB_BROWN" },
      green: { name: "청녹색", ticker: "GLSSB_GREEN" },
    },
  },
  metal: {
    name: "고철",
    ticker: "MTAL",
    sub: {
      scrap: { name: "철스크랩", ticker: "MTAL_SCRP" },
      can: { name: "철캔", ticker: "MTAL_BROWN" },
      AluminumCan: { name: "알루미늄캔", ticker: "MTAL_ALCAN" },
    },
  },
  tire: {
    name: "폐타이어",
    ticker: "TIRE",
    sub: {
      powder: { name: "고무분말", ticker: "TIRE_POWD" },
    },
  },
};
