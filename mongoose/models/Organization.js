const mongoDb = require("mongoose");

const { Schema } = mongoDb;

const organizationSchema = new Schema(
  {
    uid: { type: String, require: true, unique: true },
    title: { type: String },
    age: { type: Number, default: 1 },
  },
  { timestamps: true, versionKey: false }
);

organizationSchema.statics.create = function (paylaod) {
  const organization = new this(paylaod);
  return organization.save();
};

organizationSchema.statics.findAll = function () {
  return this.find({});
};

organizationSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

organizationSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

const Organization = mongoDb.model("organization", organizationSchema);

module.exports = { Organization };
