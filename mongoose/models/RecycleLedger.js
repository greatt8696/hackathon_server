const mongoDb = require("mongoose");
const { Schema } = mongoDb;

const RecycleLedgerSchema = new Schema({
  recycleTransactionId: { type: String, index: true },
  type: { type: String },
  lastFromTo: { type: Object },
  weigth: { type: Number },
  createdAt: { type: Date, default: Date.now },
  recycleType: { type: String },
  validity: [],
});

RecycleLedgerSchema.statics.create = function (paylaod) {
  const recycle = new this(paylaod);
  return recycle.save();
};

RecycleLedgerSchema.statics.isExist = async function (paylaod) {
  const findResult = await this.find({ hashed: paylaod });
  return findResult.length === 0 ? false : true;
};
RecycleLedgerSchema.statics.findAll = function () {
  return this.find({});
};

RecycleLedgerSchema.statics.deleteAll = function () {
  return this.deleteMany({});
};

RecycleLedgerSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

RecycleLedgerSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

RecycleLedgerSchema.statics.getWalletByid = function (id) {
  return this.remove({ id });
};

const RecycleLedger = mongoDb.model(
  "recycleTransaction",
  RecycleLedgerSchema
);

module.exports = { RecycleLedger };
