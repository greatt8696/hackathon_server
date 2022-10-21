const { ownWasteSchema } = require("./OtherSchema");

const mongoDb = require("mongoose");
const { Schema } = mongoDb;
const { ObjectId } = mongoDb.mongo;

const coinListSchema = new Schema({
  coinId: { type: ObjectId, index: true },
  ticker: { type: String },
  name: { type: String },
  origin: { type: String },
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

const CoinList = mongoDb.model("coinList", coinListSchema);

module.exports = { CoinList };
