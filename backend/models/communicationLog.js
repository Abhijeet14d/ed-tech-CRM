import mongoose from "mongoose";

const communicationLogSchema = new mongoose.Schema({
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  status: { type: String, enum: ["delivered", "failed"], default: "delivered" },
  message: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("CommunicationLog", communicationLogSchema);