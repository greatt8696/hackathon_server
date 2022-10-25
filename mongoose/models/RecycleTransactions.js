const mongoDb = require("mongoose");
const { Schema } = mongoDb;

const recycleTransactionsSchema = new Schema({
  recycleTransactionId: { type: String, index: true },
  type: { type: String },
  lastFromTo: { type: Object },
  weigth: { type: Number },
  createdAt: { type: Date, default: Date.now },
  recycleType: { type: String },
  validity: [],
});

recycleTransactionsSchema.statics.create = function (paylaod) {
  const recycle = new this(paylaod);
  return recycle.save();
};

recycleTransactionsSchema.statics.isExist = async function (paylaod) {
  const findResult = await this.find({ hashed: paylaod });
  return findResult.length === 0 ? false : true;
};
recycleTransactionsSchema.statics.findAll = function () {
  return this.find({});
};

recycleTransactionsSchema.statics.deleteAll = function () {
  return this.deleteMany({});
};

recycleTransactionsSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

recycleTransactionsSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

recycleTransactionsSchema.statics.getWalletByid = function (id) {
  return this.remove({ id });
};

const RecycleTransactions = mongoDb.model(
  "recycleTransaction",
  recycleTransactionsSchema
);

module.exports = { RecycleTransactions };
