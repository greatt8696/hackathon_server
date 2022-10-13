require("dotenv").config();

const { ACCESS_TOKEN, REFRESH_TOKEN, SESSION_KEY } = process.env;

const config = {
  dev: {
    username: "root",
    password: process.env.DATABASE_PASSWORD,
    database: "mago",
    host: "127.0.0.1", // 여기에 만약 우리가 AWS RDS 쓰거나 지원 데이터베이스 등등 사용을 한다면 이곳에 주소를 넣으면 됩니다.
    dialect: "mysql", // dial
  },
  prod: {
    username: "admin",
    password: process.env.DATABASE_PASSWORD,
    database: "mago",
    host: "127.0.0.1", // 여기에 만약 우리가 AWS RDS 쓰거나 지원 데이터베이스 등등 사용을 한다면 이곳에 주소를 넣으면 됩니다.
    dialect: "mysql", // dial
  },
};

const session_config = {
  // 세션 발급할때 사용되는 키 노출되면 안되니까 .env파일에 값을 저장해놓고 사용 process.env.SESSION_KEY
  secret: SESSION_KEY,
  // 세션을 저장하고 불러올 때 세션을 다시 저장할지 여부
  resave: false,
  // 세션에 저장할 때 초기화 여부를 설정
  saveUninitialized: true,
};

module.exports = {
  config,
  session_config,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ERR,
};
