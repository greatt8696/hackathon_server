const mongoDb = require("mongoose");
const { Schema } = mongoDb;

const position = new Schema({ lat: { type: Number }, lng: { type: Number } });

const organizationSchema = new Schema({
  organizationId: { type: String },
  name: { type: String }, // *
  businnessRole: { type: String }, // private, public, collector, selector, disposal
  position: [position], //  { lat: 12.12345, lng: 12.12345 }
});

organizationSchema.statics.create = function (paylaod) {
  const organization = new this(paylaod);
  return organization.save();
};

organizationSchema.statics.findAll = function () {
  return this.find({});
};

organizationSchema.statics.deleteAll = function () {
  return this.deleteMany({});
};
organizationSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

organizationSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

const Organization = mongoDb.model("organization", organizationSchema);

module.exports = { Organization };
