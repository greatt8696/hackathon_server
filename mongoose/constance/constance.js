module.exports = {
  userRole: {
    public: { name: "지차체" },
    collect: { name: "수거" },
    transfer: { name: "운송" },
    select: { name: "선별" },
    landfill: { name: "매립" },
    incineration: { name: "소각" },
  },
  recycleLedgerWaste: {
    plastic: { name: "플라스틱", ticker: "PLST" },
    steel: { name: "철", ticker: "STL" },
    concrete: { name: "콘크리트", ticker: "CCRT" },
    glass: { name: "유리", ticker: "GLSS" },
    paper: { name: "종이", ticker: "PAPE" },
  },
  exchange: {
    seoulExchange: { name: "서울거래소", ticker: "EXC_SEO" },
    gyeonggidoExchange: { name: "경기도거래소", ticker: "EXC_GYD" },
    incheonExchange: { name: "인천거래소", ticker: "EXC_INC" },
    gyeongsangdoExchange: { name: "경상도거래소", ticker: "EXC_GSD" },
    jeolladoExchange: { name: "전라도거래소", ticker: "EXC_JLD" },
    gangwondoExchange: { name: "전라도거래소", ticker: "EXC_GWD" },
  },
  exchange: {
    greencoin: {
      name: "그린코인",
      ticker: "GREEN",
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
        pe: { name: "PE", ticker: "FLAK_PE" },
        pp: { name: "PP", ticker: "FLAK_PP" },
        ps: { name: "PS", ticker: "FLAK_PS" },
        pvc: { name: "PVC", ticker: "FLAK_PVC" },
        abs: { name: "ABS", ticker: "FLAK_ABS" },
      },
    },
    pellet: {
      name: "펠렛",
      ticker: "PELL",
      sub: {
        pp: { name: "PP", ticker: "PELL_PP" },
        ps: { name: "PS", ticker: "PELL_PS" },
        pvc: { name: "PVC", ticker: "PELL_PVC" },
        abs: { name: "ABS", ticker: "PELL_ABS" },
      },
    },
    compress: {
      name: "압축",
      ticker: "COMP",
      sub: {
        pe: { name: "PE", ticker: "COMP_PP" },
        pp: { name: "pp", ticker: "COMP_PS" },
        pet: { name: "PET", ticker: "COMP_PET" },
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
  },
};
