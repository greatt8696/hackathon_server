const mongoDb = require("mongoose");
const { Schema } = mongoDb;

const recycleWorldTransactionsSchema = new Schema({
  recycleTransactionId: { type: String, index: true },
  type: { type: String },
  from: { type: String },
  to: { type: String },
  weigth: { type: Number },
  createdAt: { type: Date, default: Date.now },
  recycleType: [{ type: String }],
  validity: [],
});

recycleWorldTransactionsSchema.statics.create = function (paylaod) {
  const RecycleTransactions = new this(paylaod);
  return RecycleTransactions.save();
};

recycleWorldTransactionsSchema.statics.findAll = function () {
  return this.find({});
};

recycleWorldTransactionsSchema.statics.deleteAll = function () {
  return this.deleteMany({});
};

recycleWorldTransactionsSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

recycleWorldTransactionsSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

recycleWorldTransactionsSchema.statics.getWalletByid = function (id) {
  return this.remove({ id });
};

const RecycleWorldTransactions = mongoDb.model(
  "recycleWorldTransaction",
  recycleWorldTransactionsSchema
);

module.exports = { RecycleWorldTransactions };
