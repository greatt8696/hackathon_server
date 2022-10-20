const mongoDb = require("mongoose");
const { Schema } = mongoDb;
const { recycleTransactionSchema } = require("./OtherSchema");

const recycleTransactionsSchema = new Schema({
  transactions: [recycleTransactionSchema],
});

const RecycleTransactions = mongoDb.model(
  "recycleTransaction",
  recycleTransactionsSchema
);
module.exports = { RecycleTransactions };
