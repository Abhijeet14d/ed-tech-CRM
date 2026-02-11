import express from "express";
import Student from "../models/studentModel.js";
import multer from "multer";
import { parse } from "csv-parse";
import xlsx from "xlsx";
import fs from "fs";
import { client } from "../config/redisClient.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Single student upload
router.post("/profile", async (req, res) =>{
    try {
        const { name, age, email, cgpa, courseName } = req.body;
        const student = await Student.create({ name, age, email, cgpa, courseName });
        return res.status(201).json(student);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

router.get("/list", async (req, res) => {
  try {
    const students = await Student.find().select('name email _id');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student statistics
router.get("/stats", async (req, res) => {
  try {
    const total = await Student.countDocuments();
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/segment-preview", async (req, res) => {
  try {
    const { rules } = req.body; // rules: [{field, operator, value, connector}]
    const mongoOperators = { "<": "$lt", "<=": "$lte", "=": "$eq", ">=": "$gte", ">": "$gt" };
    
    // Build query with per-rule connectors
    // Strategy: Process rules sequentially, grouping AND-connected rules,
    // then OR them together when encountering OR connectors
    const buildQuery = (rules) => {
      if (rules.length === 0) return {};
      if (rules.length === 1) {
        const rule = rules[0];
        return {
          [rule.field]: { [mongoOperators[rule.operator]]: isNaN(rule.value) ? rule.value : Number(rule.value) }
        };
      }
      
      // Group rules: Start with first rule, then add based on connector
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
          // Save current AND group and start a new one
          orGroups.push(currentAndGroup.length === 1 ? currentAndGroup[0] : { $and: currentAndGroup });
          currentAndGroup = [filter];
        } else {
          // AND - add to current group
          currentAndGroup.push(filter);
        }
      }
      
      // Don't forget the last group
      orGroups.push(currentAndGroup.length === 1 ? currentAndGroup[0] : { $and: currentAndGroup });
      
      // If only one group, no need for $or
      if (orGroups.length === 1) return orGroups[0];
      return { $or: orGroups };
    };
    
    const query = buildQuery(rules);
    const students = await Student.find(query).select('name email _id').limit(100);
    const count = await Student.countDocuments(query);
    res.json({ count, students });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bulk upload
router.post("/bulk-upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    let students = [];
    
    if (req.file.mimetype === "text/csv") {
      const parser = fs.createReadStream(req.file.path).pipe(parse({ columns: true }));
      for await (const record of parser) {
        const { name, age, email, cgpa, courseName } = record;
        students.push({ name, age: Number(age), email, cgpa: Number(cgpa), courseName });
      }
    } else if (
      req.file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      req.file.mimetype === "application/vnd.ms-excel"
    ) {
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      students = rows.map(({ name, age, email, cgpa, courseName }) => ({
        name,
        age: Number(age),
        email,
        cgpa: Number(cgpa),
        courseName
      }));
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // Limit the number of records
    const MAX_RECORDS = 100000;
    if (students.length > MAX_RECORDS) {
      return res.status(400).json({ error: `You can upload a maximum of ${MAX_RECORDS} records at a time.` });
    }

    // Queue the file processing job for background worker
    await client.lPush('student_processing_queue', JSON.stringify({
      filePath: req.file.path,
      userId: req.user?.id,
      students: students,
      timestamp: new Date()
    }));

    // Send single response
    return res.status(200).json({ 
      message: "Bulk upload queued successfully", 
      count: students.length 
    });

  } catch (err) {
    console.error('Bulk upload error:', err);
    // Check if response hasn't been sent yet
    if (!res.headersSent) {
      return res.status(500).json({ error: err.message });
    }
  }
});

// Get students with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const total = await Student.countDocuments();
    const students = await Student.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      students,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalStudents: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a student
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete all students
router.delete("/", async (req, res) => {
  try {
    const result = await Student.deleteMany({});
    res.json({ 
      message: "All students deleted successfully", 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/parse-nl", async (req, res) => {
  const { query } = req.body;
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Gemini API key not set" });
    const prompt = `You are an API for a student segmentation engine.\n\nGiven a plain English description, always return ONLY a JSON array of rules, no explanation, no markdown, no extra text.\n\nEach rule: {\"field\": (name|age|email|cgpa|courseName), \"operator\": (<|<=|=|>=|>|contains), \"value\": string or number}.\n\nExample: [{\"field\": \"cgpa\", \"operator\": \">=\", \"value\": \"8\"}].\n\nDescription: ${query}`;
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let rules = [];
    try {
      rules = JSON.parse(text);
    } catch (e) {
      let match = text.match(/\[.*\]/s);
      if (!match) {
        match = text.match(/\{.*\}|\[.*\]/s);
      }
      if (match) {
        try {
          rules = JSON.parse(match[0]);
        } catch (e2) {
          rules = [];
        }
      }
    }
    if (!Array.isArray(rules) || rules.length === 0) {
      return res.status(400).json({ error: "Sorry, could not understand your description. Please try rephrasing or use simpler language.\nGemini said: " + text });
    }
    res.json({ rules, logic: "AND" });
  } catch (err) {
    res.status(500).json({ error: "Gemini API error: " + err.message });
  }
});

export default router;