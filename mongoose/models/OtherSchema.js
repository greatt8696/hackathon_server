const { Schema } = require("mongoose");

const mileStoneSchema = new Schema({
  Title: { type: String },
  content: { type: String },
  targetDate: { type: Date, default: Date.now },
});

const positionSchema = new Schema(
  {
    lat: { type: Number },
    lng: { type: Number },
  },
  { _id: false }
);

const ownWasteSchema = new Schema(
  {
    name: { type: String },
    weight: { type: Number },
  },
  { _id: false }
);

const fundingHistroySchema = new Schema(
  {
    userId: { type: String },
    coin: { type: String },
    amount: { type: Number },
  },
  { _id: false }
);
const rationaleSchema = new Schema(
  {
    type: { type: String },
    name: { type: String },
    content: { type: String },
  },
  { _id: false }
);

const coinSchema = new Schema(
  {
    ticker: { type: String },
    name: { type: String },
    position: positionSchema,
    balance: { type: Number },
  },
  { _id: false }
);

const rangeSchema = new Schema(
  {
    avr: { type: Number },
    min: { type: Number },
    max: { type: Number },
    unit: { type: String },
  },
  { _id: false }
);

module.exports = {
  mileStoneSchema,
  positionSchema,
  coinSchema,
  fundingHistroySchema,
  rationaleSchema,
  ownWasteSchema,
  rangeSchema,
};
