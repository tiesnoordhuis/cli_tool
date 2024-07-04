<?php

define('ROOT_DIRECTORY', '/var/www/html');

// Setup the directory iterator
try {
    $directory = new RecursiveDirectoryIterator(
        ROOT_DIRECTORY, 
        RecursiveDirectoryIterator::SKIP_DOTS | 
        RecursiveDirectoryIterator::CURRENT_AS_FILEINFO |
        RecursiveDirectoryIterator::KEY_AS_PATHNAME |
        RecursiveDirectoryIterator::UNIX_PATHS
    );
} catch (UnexpectedValueException $e) {
    die('Error: Could not open directory: ' . $e->getMessage());
}

define('PATTERN', '/new\s+PDO\s?\((?<arg1>[\w$]+)/');

// Traverse all php files in directory
foreach (new RecursiveIteratorIterator($directory) as $filename => $file) {
    if ($file->isFile() && $file->getExtension() === 'php') {
        $content = @file_get_contents($filename);
        if ($content === false) {
            echo "Error: Could not read file: $filename\n";
            continue;
        }
        
        $modifiedContents = preg_replace_callback(PATTERN, function ($matches) {
            $replacement = '__dsnWrapper(' . $matches['arg1'] . ')';
            return str_replace($matches['arg1'], $replacement, $matches[0]);
        }, $content);

        if ($modifiedContents === null) {
            echo "Error: Regex replacement failed in file: $filename\n";
            continue;
        }

        if ($modifiedContents !== $content) {
            $result = @file_put_contents($filename, $modifiedContents);
            if ($result === false) {
                echo "Error: Could not write to file: $filename\n";
            } else {
                echo "File updated successfully: $filename\n";
            }
        }
    }
}
?>
