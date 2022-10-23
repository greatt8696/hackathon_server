const mongoDb = require("mongoose");
const { Schema } = mongoDb;

const wallet = new Schema({
  assetName: { type: String }, // ex) Plastic, glass, ...
  ticker: { type: String }, // ex) PLA, PAPER, PE, PELLET_PP...
  balance: { type: Number }, // ex) 1000000
  assetOrigin: {
    assetType: { type: String },
    assetId: { type: Schema.Types.ObjectId },
  },
});

const UserSchema = new Schema(
  {
    userId: { type: String },
    name: { type: String },
    organizationId: { type: String },
    createdAt: { type: Date, default: Date.now },
    wallet: { type: [wallet], default: [{}] },
  },
  { timestamps: true, versionKey: false }
);

UserSchema.statics.create = function (paylaod) {
  const User = new this(paylaod);
  return User.save();
};

UserSchema.statics.findAll = function () {
  return this.find({});
};

UserSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

UserSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

UserSchema.statics.deleteAll = function () {
  return this.deleteMany({});
};

UserSchema.statics.getWalletByid = function (id) {
  return this.remove({ id });
};

const User = mongoDb.model("user", UserSchema);

module.exports = { User };
