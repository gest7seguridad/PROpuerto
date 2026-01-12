import { execSync } from 'child_process';

const port = process.env.PORT || 3000;
console.log(`Starting server on port ${port}`);

execSync(`npx serve -s dist -p ${port}`, { stdio: 'inherit' });
