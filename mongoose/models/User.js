const mongoDb = require("mongoose");
const { Schema } = mongoDb;

const UserSchema = new Schema(
  {
    userId: { type: String },
    uid: { type: String },
    email: { type: String },
    pwd: { type: String },
    name: { type: String },
    role: { type: String },
    recycleList: [{ type: String }],
    wallet: { type: String },
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
