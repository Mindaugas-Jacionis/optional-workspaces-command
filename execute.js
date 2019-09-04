#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const commandExists = require('command-exists');

const { log } = require('./utils');

const cliTool = commandExists.sync('yarn') ? 'yarn' : 'npm run';

module.exports = ({ directory, command }) => {
  const timestamp = Date.now();

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
    `Finish optional ${command} command of all ${directory} workspaces in ${(Date.now() -
      timestamp) /
      1000}s 🏁`,
  );
};
