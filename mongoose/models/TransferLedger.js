const mongoDb = require("mongoose");
const {
  Schema,
  mongo: { ObjectId },
} = mongoDb;

//{from , to, ticker, balance, createdAt}
const transferLedgerSchema = new Schema({
  lastFromTo: { type: Object },
  ticker: { type: String },
  balacne: { type: Number },
  hashed: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

transferLedgerSchema.statics.create = function (paylaod) {
  const recycle = new this(paylaod);
  return recycle.save();
};

transferLedgerSchema.statics.isExist = async function (paylaod) {
  const findResult = await this.find({ hashed: paylaod });
  // console.log("transferLedgerSchema", { hashed: paylaod });
  // console.log("transferLedgerSchema findResult:", findResult);
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
