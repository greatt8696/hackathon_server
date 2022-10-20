const mongoDb = require("mongoose");
const {
  fundingHistroySchema,
  mileStoneSchema,
  positionSchema,
} = require("./OtherSchema");
const { Schema } = mongoDb;

const techFundSchema = new Schema({
  techFundId: { type: String },
  name: { type: String },
  state: { type: String }, // 검토, 펀딩중, 펀딩완료, 사업진행중
  organizer: { type: String },
  basePoint: positionSchema,
  techType: { type: String }, // 가공, 처리,
  rationales: [{ type: Object }],
  mileStones: [mileStoneSchema],
  createdDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: Date.now },
  targetAmount: { type: Number },
  currAmount: { type: Number },
  fundHistories: [fundingHistroySchema],
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
