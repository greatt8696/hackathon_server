const mongoDb = require("mongoose");
const { Schema } = mongoDb;

const recycleSchema = new Schema({
  recycleId: {
    type: Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true,
  },
  state: { type: String, default: "normal" }, // normal, researching, funding
  igmUrl: String, // "https://~~~"
  type: String, // recycle, tech, tree
  origin: { type: Schema.Types.ObjectId },
  recycleName: String, // 플라스틱오일기술#123
  date: { type: Date, default: Date.now },
  issuer: { type: Schema.Types.ObjectId },
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

recycleSchema.statics.getWalletByid = function (id) {
  return this.remove({ id });
};

const Recycle = mongoDb.model("recycle", recycleSchema);

module.exports = { Recycle };
