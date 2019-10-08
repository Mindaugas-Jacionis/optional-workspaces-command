#!/usr/bin/env node

const shell = require('shelljs');
const { argv } = require('yargs');
const chalk = require('chalk');

const { log, deprecationWarning } = require('./utils');
const execute = require('./execute');

const timestamp = Date.now();

const TO_BE_DEPRECATED = 'optional-workspace-command';
const CORRECT_BIN_COMMAND = 'optional-workspaces-command';
// extracting cli command that has been used from argv
const runningBinCommand = argv.$0.split('/.bin/')[1];

const command = argv._[0] || argv.command || argv.cmd || argv.c;
// eventually move to using flat, but for now reduce has wider support
// const directory = [argv.directory, argv.dir, argv.d, 'packages'].filter(Boolean).flat(Infinity);
const directory = [argv.directory, argv.dir, argv.d, 'packages']
  .filter(Boolean)
  .reduce((result, item) => (Array.isArray(item) ? [...result, ...item] : [...result, item]), []);

if (!command) {
  log.error('No command to run passed');
  shell.exit(1);
}

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
