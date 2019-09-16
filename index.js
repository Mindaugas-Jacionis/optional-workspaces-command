#!/usr/bin/env node

const shell = require('shelljs');
const { argv } = require('yargs');
const chalk = require('chalk');

const { log, deprecationWarning } = require('./utils');
const execute = require('./execute');

const TO_BE_DEPRECATED = 'optional-workspace-command';
const CORRECT_BIN_COMMAND = 'optional-workspaces-command';
// extracting cli command that has been used from argv
const runningBinCommand = argv.$0.split('/.bin/')[1];

const command = argv._[0] || argv.command || argv.cmd || argv.c;
const directory = argv.directory || argv.dir || argv.d || 'packages';

if (!command) {
  log.error('No command to run passed');
  shell.exit(1);
}

const timestamp = Date.now();

if (Array.isArray(directory)) {
  directory.forEach(dir => execute({ directory: dir, command }));
} else {
  execute({ directory, command });
}

console.log(
  `⌛ ${chalk.green('Total')} execution time: ${chalk.blue.bold((Date.now() - timestamp) / 1000)}s`,
);

if (runningBinCommand === TO_BE_DEPRECATED) {
  deprecationWarning(TO_BE_DEPRECATED, CORRECT_BIN_COMMAND);
}
