import { input, select } from '@inquirer/prompts';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { cloneRepository } from './git';

const locationOptions = async ():Promise<Function> => {
    return new Promise(async (resolve, reject) => {
        select({
            message: 'Do you want to enter a repository link or local directory?',
            choices: [
                { name: 'Repository link', value: 'link' },
                { name: 'Local directory', value: 'directory' },
            ],
        })
            .then((answer) => {
                if (answer === 'link') {
                    resolve(cloneRepository)
                } else if (answer === 'directory') {
                    resolve(askDirectoryLocation)
                } else {
                    reject('Invalid option')
                }
            })
            .catch(reject)
    })
}

const askDirectoryLocation = async ():Promise<string> => {
    return new Promise(async (resolve, reject) => {
        input({
            message: 'Enter the directory location',
        })
            .then((answer) => {
                const file = path.normalize(
                    path.resolve(process.env.ORIGIN_DIRECTORY ?? process.cwd(), answer)
                );
                if (existsSync(file)) {
                    resolve(file)
                } else {
                    reject(`${file} does not exist`)
                }
            })
            .catch(reject)
    })
}

const askGitRepository = async ():Promise<string> => {
    return new Promise(async (resolve, reject) => {
        input({
            message: 'Enter the git repository',
        })
            .then((answer) => {
                if (
                    answer.startsWith('git@') &&
                    answer.endsWith('.git')
                ) {
                    resolve(answer)
                } else {
                    reject(`${answer} is not reconized as a git repository`)
                }
            })
            .catch(reject)
    })
}

const askGitRepositoryName = async (gitRepository: string):Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const nameRegex = new RegExp('(?:[\/])(?<name>[\\w-]+)(?:\\.git$)')
        const name = gitRepository.match(nameRegex)?.groups?.name
        input({
            message: 'Enter the git repository name',
            default: name,
        })
            .then((answer) => {
                resolve(answer)
            })
            .catch(reject)
    })
}

export { askDirectoryLocation, askGitRepository, askGitRepositoryName, locationOptions };