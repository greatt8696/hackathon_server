const mongoDb = require("mongoose");
const { Schema } = mongoDb;

const techFundSchema = new Schema({
  techFundId: { type: String },
  techFundUid: { type: String },
  state: { type: String, default: "normal" }, // normal, researching, funding
  type: String, // recycle, tech, green
  origin: { type: String },
  techFundName: String, // 플라스틱오일기술#123
  createdDate: { type: Date, default: Date.now },
  issuer: { type: String },
  totalCapital: Number, // 자본금(목표)
  fundingRate: { type: Number, default: 0 }, // 0% ~ 100%
  spend: { type: Number, default: 0 }, // 0 ~ totalCapital 소비량
});

techFundSchema.statics.create = function (paylaod) {
  const techFund = new this(paylaod);
  return techFund.save();
};

techFundSchema.statics.findAll = function () {
  return this.find({});
};

techFundSchema.statics.deleteAll = function () {
  return this.deleteMany({});
};

techFundSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

techFundSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};
techFundSchema.statics.getWalletByid = function (id) {
  return this.remove({ id });
};

const TechFund = mongoDb.model("techFund", techFundSchema);

module.exports = { TechFund };
