const userState = {
  유저1: {
    역할: "지자체",
    보유폐기물: 3000,
    보고서: ["보고서ID#1"],
    폐기물내역: ["재활용트랜잭션1", "재활용트랜잭션2", "재활용트랜잭션3"],
  },
  유저2: {
    역할: "수거업체",
    보유폐기물: 3000,
    폐기물내역: ["재활용트랜잭션4", "재활용트랜잭션5"],
  },
};
const { compare, encrypt } = require("./util/crypto");

(async () =>
  encrypt("123").then(async (hashedPwd) => {
    const userState = [
      {
        id: "테스트용id1",
        uid: "테스트용uid1",
        email: "test1@gmail.com",
        pwd: hashedPwd,
        name: "유저1",
        역할: "지자체",
      },
      {
        id: "테스트용id2",
        uid: "테스트용uid2",
        email: "test2@gmail.com",
        pwd: hashedPwd,
        name: "유저2",
        역할: "수거",
      },
    ];

    const wallet = [
      {
        id: "테스트용uid1",
        coins: [
          {
            ticker: "GREEN",
            name: "그린코인",
            balance: 10000000,
          },
          {
            ticker: "COMP_PET",
            name: "압축 PET",
            exchange: "EXC_SEO",
            position: { lat: 11.111, lng: 11.111 },
            balance: 500,
          },
        ],
      },
    ];

    const recycleLedger = [
      {
        id: "테스트용uid1",
        보고서: ["보고서ID#1"],
        보유폐기물: 3000,
        폐기물내역: ["재활용트랜잭션1", "재활용트랜잭션2", "재활용트랜잭션3"],
      },
      {
        id: "테스트용uid2",
        보고서: ["보고서ID#2"],
        보유폐기물: 3000,
        폐기물내역: ["재활용트랜잭션4", "재활용트랜잭션5"],
      },
    ];

    const recycle = [
      {
        id: "재활용트랜잭션1",
        유형: "발생",
        from: "지자체ID#1",
        to: "지자체ID#1",
        무게: 9000,
        날짜: "2022.10.18",
        종류: ["플라스틱", "고철캔", "고철"],
        유효성: [{ 유형: "수량부족", 대상: "유저1", 상세: "payload" }],
      },
      {
        id: "재활용트랜잭션2",
        유형: "수거",
        from: "지자체ID#1",
        to: "플라스틱수거전문ID#1",
        무게: 1000,
        날짜: "2022.10.18",
        종류: ["플라스틱"],
        유효성: [],
      },
      {
        id: "재활용트랜잭션3",
        유형: "수거",
        from: "지자체ID#1",
        to: "플라스틱수거전문ID#2",
        무게: 5000,
        날짜: "2022.10.18",
        종류: ["고철"],
        유효성: [{ 유형: "수량부족", 대상: "유저1", 상세: "payload" }],
      },
    ];
  }))();
