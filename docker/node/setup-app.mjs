// Script will setup and run the app based on its structure
// It will check for a package.json file and the scripts contained within
// If the package.json file is missing, it will look for any .js files in the app root 
// It will try to run index.js, then main.js, then app.js
// If none exist, it will run the first .js file it finds
// If no .js files exist, it will exit with an error

import { access, constants, readdir } from "fs/promises";

// read the APP_ROOT environment variable
const APP_ROOT = process.env.APP_ROOT;

// find top directory containing package.json
try {
    readdir(APP_ROOT, {
        withFileTypes: true,
        recursive: true,
    }).then((files) => {
        console.log(files);
    }).catch((error) => {
        console.trace(error);
    })
} catch (error) {
    console.trace(error);
}

// Check if the file is readable.
access(`${APP_ROOT}/package.json`, constants.R_OK)
    .then(() => {
        console.log('File is readable');
    })
    .catch(() => {
        console.trace('File is not readable');
    })