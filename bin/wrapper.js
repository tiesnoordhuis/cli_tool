#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

// Collect the arguments passed to the script
const args = process.argv.slice(2);

// Spawn the tsx process with the provided arguments
const cliProcess = spawn(
    'npx',
    [ 'tsx', fileURLToPath(new URL('../src/main.ts', import.meta.url)),...args ],
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
