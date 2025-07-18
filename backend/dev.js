import { spawn } from 'child_process';

const server = spawn('node', ['index.js'], { stdio: 'inherit' });

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
