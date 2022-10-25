const mongoDb = require("mongoose");
const { Schema } = mongoDb;
const { ObjectId } = mongoDb.mongo;

const UserSchema = new Schema(
  {
    userId: { type: String },
    uid: { type: String, index: true, unique: true },
    email: { type: String, unique: true },
    pwd: { type: String },
    name: { type: String },
    role: { type: String },
    recycleWalletId: { type: ObjectId, unique: true },
    walletId: { type: ObjectId, unique: true },
  },
  { timestamps: true, versionKey: false }
);

UserSchema.statics.create = function (payload) {
  const User = new this(payload);
  return User.save();
};

UserSchema.statics.createUser = function (payload) {
  const User = new this(payload);
  return User.save();
};

UserSchema.statics.getUserByUid = function (payload) {
  const { uid } = payload;
  return this.find({ uid });
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
