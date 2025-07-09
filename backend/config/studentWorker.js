import { createClient } from "redis";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "../models/studentModel.js";

dotenv.config();

const redisClient = createClient();
await redisClient.connect();

await mongoose.connect(process.env.MONGO_URI);

console.log("Student worker started. Waiting for jobs...");

const BATCH_SIZE = 50; // Set your batch size here

while (true) {
  // Get the length of the queue
  const queueLength = await redisClient.lLen("student_upload_queue");
  if (queueLength > 0) {
    // Fetch a batch of records
    const batch = await redisClient.lRange("student_upload_queue", 0, BATCH_SIZE - 1);
    if (batch.length > 0) {
      // Remove the batch from the queue
      await redisClient.lTrim("student_upload_queue", batch.length, -1);
      const students = batch.map(data => JSON.parse(data));
      try {
        await Student.insertMany(students, { ordered: false }); 
        console.log(`Inserted batch of ${students.length} students`);
      } catch (err) {
        console.error("Batch insert error:", err.message);
      }
      // Add a 1 second delay after each batch
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } else {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}