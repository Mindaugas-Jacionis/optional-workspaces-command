const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const { argv } = require('yargs');
var commandExists = require('command-exists');

const timestamp = Date.now();
const command = argv._[0] || argv.command;
const directory = argv._[1] || argv.directory || argv.dir || argv.d || 'packages';
const cliTool = commandExists.sync('yarn') ? 'yarn' : 'npm run';

if (!command) {
  log.error('No command to run passed');
  shell.exit(1);
}

console.log(`Starting optionaly run "${command}" command for all workspaces in ${directory} 🏎️`);

const PACKAGES_DIR_PATH = path.resolve(__dirname, directory);
const packages = fs.readdirSync(PACKAGES_DIR_PATH);

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
  const fullPath = path.resolve(__dirname, `${directory}/${pkg}`);
  const isDir = fs.statSync(fullPath).isDirectory();

  if (isDir && hasCommand(fullPath)) {
    shell.cd(fullPath);
    shell.exec(`${cliTool} ${command}`);
  }
});

console.log(
  `Finish optional ${command} command of all ${directory} workspaces in ${(Date.now() - timestamp) /
    1000}s 🏁`,
);
