const mongoDb = require("mongoose");
const { Schema } = mongoDb;

const position = new Schema({ lat: { type: Number }, lng: { type: Number } });

const organizationSchema = new Schema({
  organizationId: {
    type: Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true,
  },
  name: String, // *
  igmUrl: String, // "https://~~~"
  businessNo: String, //123-123-1234
  type: String, // public,private
  businnessRole: String, // origin, collector, selector, disposal
  contract: {
    email: { ref: String }, // asdf@gmail.com
    contract: { ref: String }, // +82-02-1234-1234
  },
  position: [position], //  { lat: 12.12345, lng: 12.12345 }
});

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
