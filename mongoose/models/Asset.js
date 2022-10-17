const mongoDb = require("mongoose");
const { Schema } = mongoDb;

const assetSchema = new Schema({
  assetId: {
    type: Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true,
  },
  assetUid: { type: String },
  state: { type: String, default: "normal" }, // normal, researching, funding
  igmUrl: String, // "https://~~~"
  type: String, // recycle, tech, tree
  origin: { type: Schema.Types.ObjectId },
  assetName: String, // 플라스틱오일기술#123
  date: { type: Date, default: Date.now },
  issuer: { type: Schema.Types.ObjectId },
  totalCapital: Number, // 자본금(목표)
  fundingRate: Number, // 0% ~ 100%
  spend: Number, // 0 ~ totalCapital 소비량
});

assetSchema.statics.create = function (paylaod) {
  const asset = new this(paylaod);
  return asset.save();
};

assetSchema.statics.findAll = function () {
  return this.find({});
};

assetSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

assetSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

assetSchema.statics.getWalletByid = function (id) {
  return this.remove({ id });
};

const Asset = mongoDb.model("asset", assetSchema);

module.exports = { Asset };
