const mongoDb = require("mongoose");
const { Schema } = mongoDb;

//{from , to, ticker, balance, createdAt}
const transferLedgerSchema = new Schema({
  lastFromTo: { type: Object },
  ticker: { type: String },
  balacne: { type: Number },
  hashed: { type: String },
  createdAt: { type: Date, default: Date.now },
});

transferLedgerSchema.statics.create = function (paylaod) {
  const recycle = new this(paylaod);
  return recycle.save();
};

transferLedgerSchema.statics.isExist = async function (paylaod) {
  const findResult = await this.find({ hashed: paylaod });
  return findResult.length === 0 ? false : true;
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
