// dev.js: Start backend server, then start student worker
import { spawn } from 'child_process';

// Start backend server
const server = spawn('node', ['index.js'], { stdio: 'inherit' });

// Wait a bit to ensure server starts, then start worker
setTimeout(() => {
  const worker = spawn('node', ['config/studentWorker.js'], { stdio: 'inherit' });
  worker.on('close', (code) => {
    console.log(`Student worker exited with code ${code}`);
  });
}, 2000);

server.on('close', (code) => {
  console.log(`Backend server exited with code ${code}`);
  process.exit(code);
});
