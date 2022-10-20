const mongoDb = require("mongoose");
const { Schema } = mongoDb;

const recycleSchema = new Schema({
  recycleId: { type: String },
  state: { type: String, default: "normal" }, // normal, researching, funding
  type: String, // recycle, tech, tree
  origin: String,
  recycleName: String, // 플라스틱오일기술#123
  createdDate: { type: Date, default: Date.now },
  issuer: String,
  totalCapital: Number, // 자본금(목표)
  fundingRate: Number, // 0% ~ 100%
  spend: Number, // 0 ~ totalCapital 소비량
});

recycleSchema.statics.create = function (paylaod) {
  const recycle = new this(paylaod);
  return recycle.save();
};

recycleSchema.statics.findAll = function () {
  return this.find({});
};

recycleSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

recycleSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

recycleSchema.statics.deleteAll = function () {
  return this.deleteMany({});
};

recycleSchema.statics.getWalletByid = function (id) {
  return this.remove({ id });
};

const Recycle = mongoDb.model("recycle", recycleSchema);

module.exports = { Recycle };
