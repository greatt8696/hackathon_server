const greenFund = [
  {
    greenFundId: "그린펀드1",
    state: "펀딩중", // 검토, 펀딩중, 펀딩완료, 사업진행중
    name: "양천구 공원참나무심기 #12",
    organizer: "테스트용uid1",
    basePoint: { lat: 11.111, lng: 11.111 },
    section: { type: "svg", path: "" },
    treeType: "참나무",
    age: { avr: 15, min: 12, max: 18, unit: "year" }, // 년
    height: { avr: 5, min: 4, max: 6, unit: "meter" }, // 미터
    createdAt: "2022.11.11",
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
    age: { avr: 15, min: 12, max: 18, unit: "year" }, // 년
    height: { avr: 5, min: 4, max: 6, unit: "meter" }, // 미터
    createdAt: "2022.10.18",
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
    createdAt: "2022.11.11",
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
    createdAt: "2022.11.11",
    endDate: "2023.12.11",
    targetAmount: 220000,
    currAmount: 220000,
    fundHistories: [{ userId: "테스트용uid2", coin: "green", amount: 220000 }],
  },
];
