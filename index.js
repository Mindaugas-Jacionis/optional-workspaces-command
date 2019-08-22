#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const { argv } = require('yargs');
var commandExists = require('command-exists');

const { log, deprecationWarning } = require('./utils');

const timestamp = Date.now();
const command = argv._[0] || argv.command || argv.c;
const directory = argv._[1] || argv.directory || argv.dir || argv.d || 'packages';
const cliTool = commandExists.sync('yarn') ? 'yarn' : 'npm run';

const TO_BE_DEPRECATED = 'optional-workspace-command';
const CORRECT_BIN_COMMAND = 'optional-workspaces-command';
// extracting cli command that has been used from argv
const runningBinCommand = argv.$0.split('/.bin/')[1];

if (!command) {
  log.error('No command to run passed');
  shell.exit(1);
}

log.info(`Starting optionaly run "${command}" command for all workspaces in ${directory} 🏎️`);

const WORKING_DIR = path.resolve('./');
const packages = fs.readdirSync(directory);

// checks if directory has package.json and needed command | returns true/false
const hasCommand = dir => {
  const packageJSONPath = path.join(dir, 'package.json');

  if (!fs.existsSync(packageJSONPath)) {
    return false;
  }

  const { scripts = {} } = fs.readJSONSync(packageJSONPath);
  return Boolean(scripts[command]);
};

// iterates over every file/dir in provided directory
// optionally runs provided command from package.json
packages.forEach(pkg => {
  const fullPath = path.resolve(WORKING_DIR, directory, pkg);
  const isDir = fs.statSync(fullPath).isDirectory();

  if (isDir && hasCommand(fullPath)) {
    shell.cd(fullPath);
    shell.exec(`${cliTool} ${command}`);
    shell.cd(WORKING_DIR);
  }
});

log.info(
  `Finish optional ${command} command of all ${directory} workspaces in ${(Date.now() - timestamp) /
    1000}s 🏁`,
);

if (runningBinCommand === TO_BE_DEPRECATED) {
  deprecationWarning(TO_BE_DEPRECATED, CORRECT_BIN_COMMAND);
}
