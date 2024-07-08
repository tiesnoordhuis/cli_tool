import { spawn } from 'child_process';
import path from 'node:path';
import { askGitRepository, askGitRepositoryName } from './prompts';
import assert from 'assert';

const cloneRepository = async ():Promise<string> => {
    return new Promise(async (resolve, reject) => {
        askGitRepository()
            .then((repository) => {
                // process.env.ORIGIN_DIRECTORY typecheck
                assert(process.env.ORIGIN_DIRECTORY, 'ORIGIN_DIRECTORY is not set');
                askGitRepositoryName(repository)
                    .then((name) => {
                        const location = path.normalize(
                            path.resolve(process.env.ORIGIN_DIRECTORY!!, name)
                        );
                        const cloneProcess = spawn(
                            'git',
                            ['clone', '--single-branch', '--depth=1', '--shallow-submodules', repository, location],
                            { stdio: 'inherit' }
                        );

                        cloneProcess.on('exit', (code) => {
                            if (code === 0) {
                                resolve(location);
                            } else {
                                reject(`cloneProcess exited with code ${code}`);
                            }
                        });
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
}

export { cloneRepository };