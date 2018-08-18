import mongoose, { Schema } from 'mongoose'
import config from '../config'

const { Types } = Schema

var ScooterSchema = new Schema({
  _id: Types.ObjectId,
  id: { type: String },
  vin: { type: String },
  model: { type: String },
  market_id: { type: String },
  license_plate: { type: String },
  energy_level: { type: Number },
  distance_to_travel: { type: Number },
  // location: { type: Types.Point },
  longitude: { type: Number },
  latitude: { type: Number },
  city_name: { type: String },
  _request_time: { type: Types.Date }
});

export default mongoose.model('Scooter', ScooterSchema, config.mongodb_collection)
