const mongoDb = require("mongoose");

const { Schema } = mongoDb;

const wallet = {
  coin: "",
  code: "",
  ticker: "",
  type: "",
  balance: 0,
  origin: Schema.Types.ObjectId,
};

const UserSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      index: true,
      required: true,
      auto: true,
    },
    name: { type: String },
    email: { type: String },
    imgUrl: { type: String },
    age: { type: Number, default: 1 },
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
