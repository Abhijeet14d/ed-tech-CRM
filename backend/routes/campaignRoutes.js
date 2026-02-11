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
    
    // Build query with per-rule connectors
    const buildQuery = (rules) => {
      if (!rules || rules.length === 0) return {};
      if (rules.length === 1) {
        const rule = rules[0];
        return {
          [rule.field]: { [mongoOperators[rule.operator]]: isNaN(rule.value) ? rule.value : Number(rule.value) }
        };
      }
      
      let orGroups = [];
      let currentAndGroup = [{
        [rules[0].field]: { [mongoOperators[rules[0].operator]]: isNaN(rules[0].value) ? rules[0].value : Number(rules[0].value) }
      }];
      
      for (let i = 1; i < rules.length; i++) {
        const rule = rules[i];
        const filter = {
          [rule.field]: { [mongoOperators[rule.operator]]: isNaN(rule.value) ? rule.value : Number(rule.value) }
        };
        
        if (rule.connector === "OR") {
          orGroups.push(currentAndGroup.length === 1 ? currentAndGroup[0] : { $and: currentAndGroup });
          currentAndGroup = [filter];
        } else {
          currentAndGroup.push(filter);
        }
      }
      
      orGroups.push(currentAndGroup.length === 1 ? currentAndGroup[0] : { $and: currentAndGroup });
      
      if (orGroups.length === 1) return orGroups[0];
      return { $or: orGroups };
    };
    
    const query = buildQuery(segment.rules);

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