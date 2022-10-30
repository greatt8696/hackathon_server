require("dotenv").config();

require("./util/jsonUtil");

const express = require("express");

const bodyParser = require("body-parser");

const app = express();

const cors = require("cors");

const recycleRouter = require("./routers/recycle");
const userRouter = require("./routers/user");

const SERVER_PORT = process.env.SERVER_PORT;

const { connectDb, initDb } = require("./mongoose");

const socketServer = require("./socket");

console.log("Socket init ");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.static("public"));

app.listen(SERVER_PORT, () => console.log("Running Server"));

connectDb().then(() => {
  initDb();
});

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/recycle", recycleRouter);
app.use("/user", userRouter);
