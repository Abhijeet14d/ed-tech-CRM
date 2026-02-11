import express from "express";
import Campaign from "../models/campaignModel.js";
import CommunicationLog from "../models/communicationLog.js";
import Student from "../models/studentModel.js";

const router = express.Router();

// Create a new campaign
router.post("/", async (req, res) => {
  try {
    const { title, message, segment, createdBy } = req.body;
    const campaign = await Campaign.create({ title, message, segment, createdBy });

    const mongoOperators = { "<": "$lt", "<=": "$lte", "=": "$eq", ">=": "$gte", ">": "$gt" };
    const filters = segment.rules.map(rule => ({
      [rule.field]: { [mongoOperators[rule.operator]]: isNaN(rule.value) ? rule.value : Number(rule.value) }
    }));
    const query = segment.logic === "AND" ? { $and: filters } : { $or: filters };

    const students = await Student.find(query);
    for (const student of students) {
      const personalized = message.replace("{name}", student.name);
      const status = Math.random() < 0.9 ? "delivered" : "failed";

      await CommunicationLog.create({
        campaignId: campaign._id,
        studentId: student._id,
        status,
        message: personalized
      });
    }

    res.status(201).json({ campaign, delivered: students.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all campaigns (history)
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate('createdBy', 'displayName email photo').sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;