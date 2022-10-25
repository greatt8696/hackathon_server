const mongoDb = require("mongoose");
const { ownWasteSchema, iORSchema } = require("./OtherSchema");
const {
  Schema,
  mongo: { ObjectId },
} = mongoDb;

const recycleWalletSchema = new Schema({
  recycleWalletId: { type: ObjectId, index: true, unique: true },
  ownWastes: [ownWasteSchema],
  iOR: iORSchema, // in / in + out
  iORHistory: [iORSchema], // [ioR : in / in + out, date:]
  recycleTransactionIds: [{ type: ObjectId }],
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
