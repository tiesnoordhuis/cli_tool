#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

// Collect the arguments passed to the script
const args = process.argv.slice(2);
// file path to main.ts
const mainScript = fileURLToPath(new URL('../src/main.ts', import.meta.url))

// Spawn the tsx process with the provided arguments
const cliProcess = spawn(
    'npx',
    [ 'tsx', mainScript, ...args ],
    {
        stdio: 'inherit',
        env: {
            ...process.env,
            ORIGIN_DIRECTORY: process.cwd(),
        
        }
    }
);

cliProcess.on('close', (code) => {
    process.exit(code);
});
