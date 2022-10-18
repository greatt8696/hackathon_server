const mongoDb = require("mongoose");
const { Schema } = mongoDb;

const wallet = new Schema({
  assetName: String, // ex) Plastic, glass, ...
  ticker: String, // ex) PLA, PAPER, PE, PELLET_PP...
  balance: Number, // ex) 1000000
  assetOrigin: {
    assetType: String,
    assetId: { type: Schema.Types.ObjectId },
  },
});

const UserSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      index: true,
      required: true,
      auto: true,
    },
    name: String,
    email: String,
    imgUrl: String,
    organizationId: { type: Schema.Types.ObjectId },
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

UserSchema.statics.getWalletByid = function (id) {
  return this.remove({ id });
};

const User = mongoDb.model("user", UserSchema);

module.exports = { User };
