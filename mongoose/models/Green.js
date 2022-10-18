const mongoDb = require("mongoose");
const { Schema } = mongoDb;

const greenSchema = new Schema({
  greenId: { type: String },
  greenUid: { type: String },
  state: { type: String, default: "normal" }, // normal, researching, funding
  type: String, // recycle, tech, tree
  origin: { type: String },
  greenName: String, // 플라스틱오일기술#123
  createddate: { type: Date, default: Date.now },
  issuer: { type: String },
  totalCapital: Number, // 자본금(목표)
  fundingRate: { type: Number, default: 0 }, // 0% ~ 100%
});

greenSchema.statics.create = function (paylaod) {
  const green = new this(paylaod);
  return green.save();
};

greenSchema.statics.findAll = function () {
  return this.find({});
};

greenSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

greenSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

greenSchema.statics.getWalletByid = function (id) {
  return this.remove({ id });
};

const Green = mongoDb.model("green", greenSchema);

module.exports = { Green };
