import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    segment: { type: Object, required: true }, // store rules/filters as JSON
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
});

const Campaign = mongoose.model("Campaign", campaignSchema);

export default Campaign;