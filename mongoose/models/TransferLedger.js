const mongoDb = require("mongoose");
const {
  Schema,
  mongo: { ObjectId },
} = mongoDb;

//{from , to, ticker, balance, createdAt}
const transferLedgerSchema = new Schema({
  from: { type: ObjectId },
  to: { type: ObjectId },
  asset: { type: String },
  balacne: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

transferLedgerSchema.statics.create = function (paylaod) {
  const recycle = new this(paylaod);
  return recycle.save();
};

transferLedgerSchema.statics.findAll = function () {
  return this.find({});
};

transferLedgerSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

transferLedgerSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

transferLedgerSchema.statics.deleteAll = function () {
  return this.deleteMany({});
};

transferLedgerSchema.statics.getWalletByid = function (id) {
  return this.remove({ id });
};

const TransferLedger = mongoDb.model("transferLedger", transferLedgerSchema);

module.exports = { TransferLedger };
