const { compare, encrypt } = require("./util/crypto");

const user = [
  {
    userId: "테스트용id1",
    uid: "테스트용uid1",
    email: "test1@gmail.com",
    pwd: "$2b$08$SHqWBDxEgdvxRtSu0udOBuiog93YoctPuEJz9vksEycc5ttcsiJaq",
    name: "지자체유저1",
    role: "지자체",
    recycleLedgerIds: ["재활용장부테스트용uid1"],
    walletId: "지갑테스트용id1",
  },
  {
    userId: "테스트용id2",
    uid: "테스트용uid2",
    email: "test2@gmail.com",
    pwd: "$2b$08$SHqWBDxEgdvxRtSu0udOBuiog93YoctPuEJz9vksEycc5ttcsiJaq",
    name: "수거유저2",
    role: "수거",
    recycleLedgerIds: ["재활용장부테스트용uid1"],
    walletId: "지갑테스트용id1",
  },
  {
    userId: "테스트용id3",
    uid: "테스트용uid3",
    email: "test2@gmail.com",
    pwd: "$2b$08$SHqWBDxEgdvxRtSu0udOBuiog93YoctPuEJz9vksEycc5ttcsiJaq",
    name: "수거유저3",
    role: "수거",
    recycleLedgerIds: ["재활용장부테스트용uid3"],
    walletId: "지갑테스트용id3",
  },
];

const wallet = [
  {
    walletId: "지갑테스트용id1",
    onwer: "테스트용uid1",
    coins: [
      {
        ticker: "GREEN",
        name: "그린코인",
        position: { lat: 0, lng: 0 },
        balance: 10000000,
      },
      {
        ticker: "COMP_PET",
        name: "압축 PET",
        exchange: "EXC_SEO",
        position: { lat: 11.111, lng: 11.111 },
        balance: 1100,
      },
      {
        ticker: "FLAKE_PP",
        name: "플레이크 PP",
        exchange: "EXC_SEO",
        position: { lat: 11.111, lng: 11.111 },
        balance: 1100,
      },
    ],
  },
  {
    walletId: "지갑테스트용id2",
    onwer: "테스트용uid2",
    coins: [
      {
        ticker: "GREEN",
        name: "그린코인",
        balance: 22222222220,
      },
      {
        ticker: "GLSS",
        name: "압축 PET",
        exchange: "EXC_SEO",
        position: { lat: 11.111, lng: 11.111 },
        balance: 22200,
      },
      {
        ticker: "FLAKE_PP",
        name: "플레이크 PP",
        exchange: "EXC_SEO",
        position: { lat: 11.111, lng: 11.111 },
        balance: 22200,
      },
    ],
  },
  {
    walletId: "지갑테스트용id3",
    onwer: "테스트용uid3",
    coins: [
      {
        ticker: "GREEN",
        name: "그린코인",
        balance: 3333333,
      },
    ],
  },
];

const recycleLedger = [
  {
    recycleLedgerId: "테스트용uid1",
    ownWastes: [
      { name: "플라스틱", weight: 2000 },
      { name: "고철캔", weight: 1500 },
      { name: "고철", weight: 1000 },
    ],
    recycleTransactionIds: [
      "재활용트랜잭션1",
      "재활용트랜잭션2",
      "재활용트랜잭션3",
    ],
  },
  {
    recycleLedgerId: "테스트용uid2",
    ownWastes: [
      { name: "폐지", weight: 222 },
      { name: "플라스틱", weight: 2200 },
      { name: "유리병", weight: 2000 },
    ],
    recycleTransactionIds: [
      "재활용트랜잭션1",
      "재활용트랜잭션2",
      "재활용트랜잭션3",
    ],
  },
];

const recycleWorldTransaction = {
  recycleTransactions: [
    {
      recycleTransactionId: "재활용트랜잭션1",
      type: "발생",
      from: "지자체ID#1",
      to: "지자체ID#1",
      weigth: 9000,
      createdDate: "2022.10.18",
      recycleType: ["플라스틱", "고철캔", "고철"],
      validity: [],
    },
    {
      recycleTransactionId: "재활용트랜잭션2",
      type: "수거",
      from: "지자체ID#1",
      to: "플라스틱수거전문ID#1",
      weigth: 1000,
      createdDate: "2022.10.18",
      recycleType: ["플라스틱"],
      validity: [],
    },
    {
      recycleTransactionId: "재활용트랜잭션3",
      type: "수거",
      from: "지자체ID#1",
      to: "플라스틱수거전문ID#2",
      weigth: 5000,
      createdDate: "2022.10.18",
      recycleType: ["고철"],
      validity: [{ type: "수량부족", user: "유저1", details: "payload" }],
    },
  ],
};

const greenFund = [
  {
    greenFundId: "그린펀드1",
    state: "펀딩중", // 검토, 펀딩중, 펀딩완료, 사업진행중
    name: "양천구 공원참나무심기 #12",
    organizer: "테스트용uid1",
    basePoint: { lat: 11.111, lng: 11.111 },
    section: { type: "svg", path: "" },
    treeType: "참나무",
    age: { avr: 15, min: 12, max: 18 }, // 년
    height: { avr: 5, min: 4, max: 6 }, // 미터
    createdDate: "2022.11.11",
    endDate: "2023.12.11",
    targetAmount: 150000,
    currAmount: 150000,
    fundHistories: [{ userId: "테스트용uid1", coin: "green", amount: 150000 }],
  },
  {
    greenFundId: "그린펀드2",
    name: "천호 공원은행나무심기 #33",
    state: "펀딩중", // 검토, 펀딩중, 펀딩완료, 사업진행중
    organizer: "테스트용uid2",
    basePoint: { lat: 22.2222, lng: 22.2222 },
    section: { type: "svg", path: "" },
    treeType: "은행나무",
    age: { avr: 15, min: 12, max: 18 }, // 년
    height: { avr: 5, min: 4, max: 6 }, // 미터
    createdDate: "2022.10.18",
    endDate: "2022.12.18",
    targetAmount: 2200000,
    currAmount: 500000,
    fundHistories: [
      { userId: "테스트용uid2", coin: "green", amount: 200000 },
      { userId: "테스트용uid3", coin: "green", amount: 100000 },
      { userId: "테스트용uid4", coin: "green", amount: 200000 },
    ],
  },
];
const techFund = [
  {
    techFundId: "테크펀드id1",
    name: "플라스틱 유전 #12",
    state: "펀딩중", // 검토, 펀딩중, 펀딩완료, 사업진행중
    organizer: "테스트용uid1",
    basePoint: { lat: 11.111, lng: 11.111 },
    techType: "가공", // 가공, 처리,
    rationales: [
      { type: "url", name: "근거이론1", content: "https://naver.com" },
    ],
    mileStone: [
      {
        Title: "달성목표11",
        content: "달성목표내용11",
        targetDate: "2022.11.11",
      },
      {
        Title: "달성목표12",
        content: "달성목표내용12",
        targetDate: "2023.05.22",
      },
      {
        Title: "달성목표13",
        content: "달성목표내용13",
        targetDate: "2023.12.11",
      },
    ],
    createdDate: "2022.11.11",
    endDate: "2023.12.11",
    targetAmount: 150000,
    currAmount: 100000,
    fundHistories: [{ userId: "테스트용uid1", coin: "green", amount: 100000 }],
  },
  {
    techFundId: "테크펀드id2",
    name: "플라스틱벽돌 #12",
    state: "펀딩완료", // 검토, 펀딩중, 펀딩완료, 사업진행중
    organizer: "테스트용uid2",
    basePoint: { lat: 11.111, lng: 11.111 },
    techType: "제품", // 가공, 처리, 제품
    rationales: [
      { type: "url", name: "근거이론2", content: "https://naver.com" },
    ],
    mileStones: [
      {
        Title: "달성목표21",
        content: "달성목표내용21",
        targetDate: "2022.11.11",
      },
      {
        Title: "달성목표22",
        content: "달성목표내용22",
        targetDate: "2023.05.22",
      },
      {
        Title: "달성목표23",
        content: "달성목표내용23",
        targetDate: "2023.12.11",
      },
    ],
    createdDate: "2022.11.11",
    endDate: "2023.12.11",
    targetAmount: 220000,
    currAmount: 220000,
    fundHistories: [{ userId: "테스트용uid2", coin: "green", amount: 220000 }],
  },
];

module.exports = {
  user,
  wallet,
  recycleLedger,
  recycleWorldTransaction,
  techFund,
  greenFund,
};
