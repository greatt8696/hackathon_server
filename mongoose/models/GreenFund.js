const mongoDb = require("mongoose");
const {
  fundingHistroySchema,
  positionSchema,
  rangeSchema,
} = require("./OtherSchema");
const { Schema } = mongoDb;

const greenFundSchema = new Schema({
  greenFundId: { type: String, index: true },
  state: { type: String },
  name: { type: String },
  organizer: { type: String },
  basePoint: positionSchema,
  section: { type: Object },
  treeType: { type: String },
  age: rangeSchema, // 년
  height: rangeSchema, // 미터
  createdDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: Date.now },
  targetAmount: { type: Number },
  currAmount: { type: Number },
  fundHistories: [fundingHistroySchema],
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
