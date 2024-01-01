import mongoose, { Document, Schema } from "mongoose";

interface IRateLimit extends Document {
  ip: string;
  count: number;
  lastRequest: Date;
}

const RateLimitSchema: Schema = new Schema({
  ip: { type: String, required: true, unique: true },
  count: { type: Number, required: true },
  lastRequest: { type: Date, required: true },
});

export default mongoose.models.RateLimit ||
  mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);
