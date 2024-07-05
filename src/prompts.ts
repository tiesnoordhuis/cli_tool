import { input } from '@inquirer/prompts';

const askRepository = async ():Promise<string> => {
    return new Promise(async (resolve, reject) => {
        input({
            message: 'Enter the repository source',
        })
            .then((answer) => {
                // TODO: check if repo excists
                resolve(answer)
            })
            .catch(reject)
    })
}

export { askRepository };