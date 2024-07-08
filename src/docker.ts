import { spawn } from 'child_process';
import { locationOptions } from './prompts';
import { fileURLToPath } from 'url';
import { logStream } from './logging';

const dockerPath = fileURLToPath(new URL('../docker/', import.meta.url));

const composeDown = async ():Promise<void> => {
    return new Promise((resolve, reject) => {
        const composeDownProcess = spawn('docker', ['compose', '--project-directory', dockerPath, 'down', '--volumes'], {
            stdio: 'inherit',
        });
    
        composeDownProcess.on('exit', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(`composeDownProcess exited with code ${code}`);
            }
        });
    });
}

const composeBuild = async ():Promise<void> => {
    return new Promise((resolve, reject) => {
        const composeBuildProcess = spawn('docker', ['compose', '--project-directory', dockerPath, 'build'], {
            stdio: 'inherit',
        });
    
        composeBuildProcess.on('exit', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(`composeBuildProcess exited with code ${code}`);
            }
        });
    });
}

const composeUp = async ():Promise<void> => {
    return new Promise(async(resolve, reject) => {
        locationOptions()
            .then((askLocation) => askLocation())
            .then((repository) => {
                console.log('Repository: ', repository);
                
                const composeUpProcess = spawn('docker', ['compose', '--project-directory', dockerPath, 'up'], {
                    env: {
                        ...process.env,
                        REPO_SOURCE: repository,
                    }
                });

                composeUpProcess.stdout?.on('data', (data) => {
                    logStream.write(data)
                    process.stdout.write(data)
                })

                composeUpProcess.on('exit', (code) => {
                    logStream.end()
                    if (code === 0) {
                        resolve();
                    } else {
                        reject(`composeUpProcess exited with code ${code}`);
                    }
                })
            }).catch((error) => {
                reject(error);
            });
    });
}

const composeRestart = async ():Promise<void> => {
    return new Promise((resolve, reject) => {
        composeDown()
            .then(() => composeBuild())
            .then(() => composeUp())
            .then(() => resolve())
            .catch((error) => reject(error));
    });
}

export {
    composeDown,
    composeBuild,
    composeUp,
    composeRestart,
};