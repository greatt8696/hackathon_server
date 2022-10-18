const mongoDb = require("mongoose");
const { Schema } = mongoDb;

const techSchema = new Schema({
  techId: { type: String },
  techUid: { type: String },
  state: { type: String, default: "normal" }, // normal, researching, funding
  type: String, // recycle, tech, tree
  origin: { type: String },
  techName: String, // 플라스틱오일기술#123
  createddate: { type: Date, default: Date.now },
  issuer: { type: String },
  totalCapital: Number, // 자본금(목표)
  fundingRate: { type: Number, default: 0 }, // 0% ~ 100%
  spend: { type: Number, default: 0 }, // 0 ~ totalCapital 소비량
});

techSchema.statics.create = function (paylaod) {
  const tech = new this(paylaod);
  return tech.save();
};

techSchema.statics.findAll = function () {
  return this.find({});
};

techSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

techSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

techSchema.statics.getWalletByid = function (id) {
  return this.remove({ id });
};

const Tech = mongoDb.model("tech", techSchema);

module.exports = { Tech };
