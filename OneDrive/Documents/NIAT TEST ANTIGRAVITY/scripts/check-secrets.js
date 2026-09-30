import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '../client/dist');

if (!fs.existsSync(distDir)) {
  console.log('client/dist does not exist. Run client build first.');
  process.exit(0);
}

function searchDirectory(dir, patterns) {
  const files = fs.readdirSync(dir);
  let found = false;

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (searchDirectory(fullPath, patterns)) {
        found = true;
      }
    } else {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const pattern of patterns) {
        if (content.includes(pattern)) {
          console.error(`SECURITY ERROR: Found sensitive pattern "${pattern}" in file: ${fullPath}`);
          found = true;
        }
      }
    }
  }
  return found;
}

const forbiddenPatterns = ['GEMINI_API_KEY', 'GEMINI', 'service_role', 'SUPABASE_SERVICE_ROLE_KEY'];
console.log('Checking client/dist for secret leaks...');

const leaked = searchDirectory(distDir, forbiddenPatterns);

if (leaked) {
  console.error('FAILED: Secrets detected in client bundle!');
  process.exit(1);
} else {
  console.log('PASSED: No secrets found in client build.');
}
