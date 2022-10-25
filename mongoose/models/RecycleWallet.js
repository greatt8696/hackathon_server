const mongoDb = require("mongoose");
const { ownWasteSchema } = require("./OtherSchema");
const { Schema } = mongoDb;

const recycleWalletSchema = new Schema({
  recycleWalletId: { type: String, index: true, unique: true },
  ownWastes: [ownWasteSchema],
  recycleTransactionIds: [{ type: String }],
});

recycleWalletSchema.statics.create = function (paylaod) {
  const recycle = new this(paylaod);
  return recycle.save();
};

recycleWalletSchema.statics.findAll = function () {
  return this.find({});
};

recycleWalletSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

recycleWalletSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

recycleWalletSchema.statics.deleteAll = function () {
  return this.deleteMany({});
};

recycleWalletSchema.statics.getWalletByid = function (id) {
  return this.remove({ id });
};

const RecycleWallet = mongoDb.model("recycleWallet", recycleWalletSchema);

module.exports = { RecycleWallet };
