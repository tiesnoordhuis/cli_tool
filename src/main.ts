import { parseArgs } from 'node:util';
import { select } from '@inquirer/prompts';
import { composeDown, composeBuild, composeUp, composeRestart } from './docker';

const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
        'skip': {
            type: 'boolean',
            short: 's',
        },
    }
});

// action types down, up and build
type actionType = 'down' | 'up' | 'build' | 'restart';

const action: actionType = values?.skip ? 'restart' : await select({
    message: 'Select an action',
    choices: [
        { name: 'Restart', value: 'restart' },
        { name: 'Down', value: 'down' },
        { name: 'Up', value: 'up' },
        { name: 'Build', value: 'build' },
    ],
});

try {
    // switch between cases
    switch (action) {
        case 'down':
            composeDown()
                .catch((error) => {
                    console.trace('Error: ', error);
                });
            break;
        case 'up':
            composeUp()
                .catch((error) => {
                    console.trace('Error: ', error);
                });
            break;
        case 'build':
            composeBuild()
                .catch((error) => {
                    console.trace('Error: ', error);
                });
            break;
        case 'restart':
            composeRestart()
                .catch((error) => {
                    console.trace('Error: ', error);
                });
            break;
    }
} catch (error) {
    console.error('Error: ', error);
}