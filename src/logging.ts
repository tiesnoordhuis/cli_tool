import { createWriteStream } from 'fs';
import { fileURLToPath } from 'url';

const logPath = fileURLToPath(new URL('../log/', import.meta.url));

const logFile = `${logPath}docker-compose-output.log`;

const logStream = createWriteStream(logFile, { flags: 'a' }); // 'a' for append mode

export { logStream }