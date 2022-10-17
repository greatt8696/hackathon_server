const mongoDb = require("mongoose");

const { Schema } = mongoDb;

const UserSchema = new Schema(
  {
    id: { type: Schema.Types.ObjectId },
    title: { type: String },
    age: { type: Number, default: 1 },
    wallet: { type: [Schema.Types.ObjectId], default: [{}] },
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

const User = mongoDb.model("user", UserSchema);

module.exports = { User };
