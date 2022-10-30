require("dotenv").config();

require("./util/jsonUtil");

const express = require("express");

const bodyParser = require("body-parser");

const app = express();

const cors = require("cors");

const recycleRouter = require("./routers/recycle");

const SERVER_PORT = process.env.SERVER_PORT;

const { connectDb, initDb } = require("./mongoose");

const socketServer = require("./socket");

const { coinData, candleData } = require("./chartData");

console.log("Socket init ");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.static("public"));

app.listen(3600, () => console.log("Running Server"));

connectDb().then(() => {
  initDb();
});

app.use(express.json());


app.use(express.urlencoded({ extended: false }));

app.use("/recycle", recycleRouter);


const coinDatas = { coin: coinData, candle: candleData };
