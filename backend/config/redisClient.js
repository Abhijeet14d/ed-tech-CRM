import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT)
    }
});

client.on('error', err => console.log('Redis Client Error', err));

// Connect to Redis
const connectRedis = async () => {
    try {
        await client.connect();
        console.log('Connected to Redis Cloud');
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
};

// Remove the test code and export the client and connect function
export { client, connectRedis };