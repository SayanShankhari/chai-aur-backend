import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// 1. Define paths and generate 64-character secure hex strings
const envPath = path.resolve(process.cwd(), '.env');
const accessSecret = crypto.randomBytes(32).toString('hex');
const refreshSecret = crypto.randomBytes(32).toString('hex');

// 2. Prepare the new lines to be inserted
const accessLine = `JWT_ACCESS_SECRET=${accessSecret}`;
const refreshLine = `JWT_REFRESH_SECRET=${refreshSecret}`;

let envContent = '';

// 3. Read existing .env file if it exists
if (fs.existsSync (envPath)) {
	envContent = fs.readFileSync (envPath, 'utf8');
}

// 4. Update or append JWT_ACCESS_SECRET
if (envContent.includes ('JWT_ACCESS_SECRET=')) {
	envContent = envContent.replace (/JWT_ACCESS_SECRET=.*/, accessLine);
} else {
	envContent += envContent.endsWith ('\n') || envContent === '' ? `${accessLine}\n` : `\n${accessLine}\n`;
}

// 5. Update or append JWT_REFRESH_SECRET
if (envContent.includes ('JWT_REFRESH_SECRET=')) {
	envContent = envContent.replace (/JWT_REFRESH_SECRET=.*/, refreshLine);
} else {
	envContent += envContent.endsWith ('\n') ? `${refreshLine}\n` : `\n${refreshLine}\n`;
}

// 6. Write the updated content back to the .env file
fs.writeFileSync (envPath, envContent, 'utf8');
console.log ('✅ JWT secrets successfully generated and saved to .env');