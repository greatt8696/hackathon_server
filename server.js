require("dotenv").config();

const express = require("express");

const bodyParser = require("body-parser");

const app = express();

const recycleRouter = require("./routers/recycle");

const PORT = "3600";

const { mongoDb, initDb } = require("./mongoose/dbManager");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use("/recycle", recycleRouter);

app.listen(PORT, () => {
  console.log("Running Server");
});

initDb();
