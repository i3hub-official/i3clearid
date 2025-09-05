// dev-server.js
import { createServer } from 'https';
import next from 'next';
import fs from 'fs';
import os from 'os';
import dotenv from 'dotenv';

// Load environment variables from .env.local or .env
dotenv.config({ path: '.env.local' });

// Get cert paths from environment
const certPath = process.env.SSL_CERTIFICATE;
const keyPath = process.env.SSL_KEY;

if (!certPath || !keyPath) {
    console.error('❌ SSL_CERTIFICATE or SSL_KEY not set in environment variables.');
    process.exit(1);
}

const app = next({ dev: true });
const handle = app.getRequestHandler();

// Get all LAN IPv4 addresses
const interfaces = os.networkInterfaces();
const lanIps = Object.values(interfaces)
    .flat()
    .filter(i => i.family === 'IPv4' && !i.internal)
    .map(i => i.address);

app.prepare().then(() => {
    createServer({
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
    }, (req, res) => {
        handle(req, res);
    }).listen(3000, '0.0.0.0', () => {
        console.log('> ✅ HTTPS server ready on https://localhost:3000');
        lanIps.forEach(ip => {
            console.log(`> 🌐 Accessible via LAN: https://${ip}:3000`);
        });
    });
});
