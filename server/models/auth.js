import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
  ip: String,
  device: String,
  browser: String,
  os: String,
  loginTime: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  about: { type: String },
  tags: { type: [String] },
  joinedon: { type: Date, default: Date.now },
  loginHistory: [loginHistorySchema],
  otp: { type: String, required: false },
});

export default mongoose.model("User", userSchema);
