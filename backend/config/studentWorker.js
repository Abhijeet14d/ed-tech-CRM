import { client, connectRedis } from './redisClient.js';
import mongoose from 'mongoose';
import Student from '../models/studentModel.js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Connect to Redis and MongoDB with proper error handling
try {
  await connectRedis();
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  console.log('Worker: Connected to MongoDB and Redis');
} catch (error) {
  console.error('Worker: Database connection failed:', error);
  process.exit(1);
}

const BATCH_SIZE = 100; // Process 100 students at a time
const BATCH_DELAY = 1000; // 1 second delay between batches

const processStudentData = async () => {
    console.log('Student worker started, waiting for jobs...');
    
    while (true) {
        try {
            const job = await client.brPop('student_processing_queue', 0);
            if (job) {
                const jobData = JSON.parse(job.element);
                console.log('Processing job:', { 
                    totalStudents: jobData.students?.length, 
                    userId: jobData.userId,
                    batchSize: BATCH_SIZE
                });
                
                // Process students in batches
                if (jobData.students && jobData.students.length > 0) {
                    await processBatches(jobData.students);
                }
                
                // Clean up uploaded file
                if (jobData.filePath && fs.existsSync(jobData.filePath)) {
                    fs.unlinkSync(jobData.filePath);
                    console.log('Cleaned up uploaded file');
                }
                
                console.log('Job completed successfully');
            }
        } catch (error) {
            console.error('Error processing job:', error);
        }
    }
};

const processBatches = async (students) => {
    const totalBatches = Math.ceil(students.length / BATCH_SIZE);
    
    for (let i = 0; i < students.length; i += BATCH_SIZE) {
        const batch = students.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        
        try {
            console.log(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} students)...`);
            
            // Insert current batch
            await Student.insertMany(batch);
            
            console.log(`✅ Batch ${batchNumber}/${totalBatches} completed - ${batch.length} students inserted`);
            
            // Add delay between batches (except for the last batch)
            if (i + BATCH_SIZE < students.length) {
                await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
            }
            
        } catch (error) {
            console.error(`❌ Error processing batch ${batchNumber}:`, error);
            // Continue with next batch even if current batch fails
        }
    }
    
    console.log(`🎉 All batches completed! Total students processed: ${students.length}`);
};

processStudentData();