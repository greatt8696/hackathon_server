const mongoDb = require("mongoose");
const { Schema } = mongoDb;

const greenFundSchema = new Schema({
  greenFundId: { type: String },
  greenFundUid: { type: String },
  state: { type: String, default: "normal" }, // normal, researching, funding
  type: String, // recycle, tech, tree
  origin: { type: String },
  greenFundName: String, // 플라스틱오일기술#123
  createdDate: { type: Date, default: Date.now },
  issuer: { type: String },
  totalCapital: Number, // 자본금(목표)
  fundingRate: { type: Number, default: 0 }, // 0% ~ 100%
});

greenFundSchema.statics.create = function (paylaod) {
  const greenFund = new this(paylaod);
  return greenFund.save();
};

greenFundSchema.statics.findAll = function () {
  return this.find({});
};

greenFundSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

greenFundSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

greenFundSchema.statics.getWalletByid = function (id) {
  return this.remove({ id });
};

greenFundSchema.statics.deleteAll = function () {
  return this.deleteMany({});
};

const GreenFund = mongoDb.model("greenFund", greenFundSchema);

module.exports = { GreenFund };
