const mongoDb = require("mongoose");
const { ownWasteSchema } = require("./OtherSchema");
const { Schema } = mongoDb;

const recycleLedgerSchema = new Schema({
  recycleLedgerId: { type: String },
  ownWastes: [ownWasteSchema],
  recycleTransactionIds: [{ type: String }],
});

recycleLedgerSchema.statics.create = function (paylaod) {
  const recycle = new this(paylaod);
  return recycle.save();
};

recycleLedgerSchema.statics.findAll = function () {
  return this.find({});
};

recycleLedgerSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

recycleLedgerSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

recycleLedgerSchema.statics.deleteAll = function () {
  return this.deleteMany({});
};

recycleLedgerSchema.statics.getWalletByid = function (id) {
  return this.remove({ id });
};

const RecycleLedger = mongoDb.model("recycleLedger", recycleLedgerSchema);

module.exports = { RecycleLedger };
