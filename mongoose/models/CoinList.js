const mongoDb = require("mongoose");
const { ownWasteSchema } = require("./OtherSchema");
const { Schema } = mongoDb;

const coinListSchema = new Schema({
  ticker: { type: String },
  name: { type: String },
  recycleTransactionIds: [{ type: String }],
});

coinListSchema.statics.create = function (paylaod) {
  const recycle = new this(paylaod);
  return recycle.save();
};

coinListSchema.statics.findAll = function () {
  return this.find({});
};

coinListSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

coinListSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

coinListSchema.statics.deleteAll = function () {
  return this.deleteMany({});
};

coinListSchema.statics.getWalletByid = function (id) {
  return this.remove({ id });
};

const coinList = mongoDb.model("coinList", coinListSchema);

module.exports = { coinList };
