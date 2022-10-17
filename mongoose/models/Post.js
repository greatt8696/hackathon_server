const mongoDb = require("mongoose");

const { Schema } = mongoDb;

const postSchema = new Schema(
  {
    uid: { type: String, require: true, unique: true },
    title: { type: String },
    age: { type: Number, default: 1 },
  },
  { timestamps: true, versionKey: false }
);

postSchema.statics.create = function (paylaod) {
  const post = new this(paylaod);
  return post.save();
};

postSchema.statics.findAll = function () {
  return this.find({});
};

postSchema.statics.updateByUid = function (id, payload) {
  return this.findOneAndUpdate({ id }, payload, { new: true });
};

postSchema.statics.deleteByUid = function (id) {
  return this.remove({ id });
};

const Post = mongoDb.model("Post", postSchema);

module.exports = { Post };
