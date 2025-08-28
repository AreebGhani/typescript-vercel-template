import { execSync } from 'child_process';

const path = execSync('npm root -g').toString().trim();
process.stdout.write(path);
