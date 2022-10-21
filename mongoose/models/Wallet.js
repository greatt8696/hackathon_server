const mongoDb = require("mongoose");
const { coinSchema } = require("./OtherSchema");
const { Schema } = mongoDb;
const { ObjectId } = mongoDb.mongo;

const walletSchema = new Schema({
  walletId: { type: ObjectId, index: true },
  coins: [coinSchema],
});

walletSchema.statics.create = function (paylaod) {
  const wallet = new this(paylaod);
  return wallet.save();
};

walletSchema.statics.findAll = function () {
  return this.find({});
};

walletSchema.statics.findById = function (walletId) {
  return this.find({ walletId: walletId });
};

walletSchema.statics.deleteAll = function () {
  return this.deleteMany({});
};

walletSchema.statics.updateById = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

walletSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

const Wallet = mongoDb.model("wallet", walletSchema);

module.exports = { Wallet };
