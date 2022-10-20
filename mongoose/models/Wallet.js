const mongoDb = require("mongoose");
const { coinSchema } = require("./OtherSchema");
const { Schema } = mongoDb;

const walletSchema = new Schema({
  walletId: { type: String },
  onwer: { type: String },
  coins: [coinSchema],
});

walletSchema.statics.create = function (paylaod) {
  const wallet = new this(paylaod);
  return wallet.save();
};

walletSchema.statics.findAll = function () {
  return this.find({});
};

walletSchema.statics.deleteAll = function () {
  return this.deleteMany({});
};
walletSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

walletSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

const Wallet = mongoDb.model("wallet", walletSchema);

module.exports = { Wallet };
