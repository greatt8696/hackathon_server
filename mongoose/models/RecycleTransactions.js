const mongoDb = require("mongoose");
const { Schema } = mongoDb;
const { recycleTransactionSchema } = require("./OtherSchema");

const recycleWorldTransactionSchema = new Schema({
  recycleTransactions: [recycleTransactionSchema],
});

recycleWorldTransactionSchema.statics.create = function (paylaod) {
  const RecycleTransactions = new this(paylaod);
  return RecycleTransactions.save();
};

recycleWorldTransactionSchema.statics.findAll = function () {
  return this.find({});
};

recycleWorldTransactionSchema.statics.deleteAll = function () {
  return this.deleteMany({});
};

recycleWorldTransactionSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

recycleWorldTransactionSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

recycleWorldTransactionSchema.statics.getWalletByid = function (id) {
  return this.remove({ id });
};

const RecycleWorldTransactions = mongoDb.model(
  "recycleWorldTransaction",
  recycleWorldTransactionSchema
);

module.exports = { RecycleWorldTransactions };
