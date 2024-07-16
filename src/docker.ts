import { spawn } from 'child_process';
import { loadEnvFile } from 'node:process';
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
            .then(async (repository) => {
                console.log('Repository: ', repository);

                // load env file
                loadEnvFile(`${dockerPath}/.env`);

                handleRunningContainers()
                    .then(() => {
                        console.log('Starting compose up...');
                        
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

const checkRunningContainers = async ():Promise<{port:string, name:string}[]> => {
    return new Promise((resolve, reject) => {
        const checkRunningContainersProcess = spawn(
            'docker',
            ['ps', '--filter', 'status=running', '--format', '{{.Ports}}|{{.Names}}'],
            { stdio: 'pipe' }
        );
        let runningContainers: {port:string, name:string}[] = [];

        checkRunningContainersProcess.stdout?.on('data', (data) => {
            const regex = new RegExp('0\\.0\\.0\\.0:(?<port>\\d+).*?\\|(?<name>[\\w-]+)', 'gm')
            runningContainers = [...data.toString().matchAll(regex)].map((match) => match.groups);
        });

        checkRunningContainersProcess.on('exit', (code) => {
            if (code === 0) {
                resolve(runningContainers);
            } else {
                reject(`checkRunningContainersProcess exited with code ${code}`);
            }
        });
    });
}

const handleRunningContainers = async ():Promise<void> => {
    return new Promise(async (resolve, reject) => {
        const runningContainers = await checkRunningContainers();
        const duplicateContainers = runningContainers.filter((container) => {
            // TODO determine services that would be started and corresponding ports
            const portsToBeUsed = [
                process.env.PHP_PORT,
                process.env.MYSQL_PORT,
                process.env.NODE_PORT,
            ];
            return portsToBeUsed.includes(container.port);
        })

        if (duplicateContainers.length > 0) {
            console.log('Running containers: ', runningContainers);
            // TODO ask user if they want to stop running containers
            console.log('Stopping running containers...');

            const stopRunningContainersProcess = spawn(
                'docker',
                ['stop', ...duplicateContainers.map((container) => container.name)],
                { stdio: 'pipe' }
            );

            stopRunningContainersProcess.on('exit', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(`stopRunningContainersProcess exited with code ${code}`);
                }
            });
        } else {
            resolve();
        }
    });
}