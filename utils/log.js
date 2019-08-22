const chalk = require('chalk');

const label = {
  error: chalk.red.bold('❌   Error'),
  info: chalk.blue.bold('ℹ️    Info'),
  warning: chalk.yellow.bold('⚠️    Warning'),
};

const getMessage = args => chalk.hex('#818181').underline.bold([...args].join(' '));

function info() {
  console.info(`${label.info}: ${getMessage(arguments)}`);
}

function warning() {
  console.warn(`${label.warning}: ${getMessage(arguments)}`);
}

function error() {
  console.error(`${label.error}: ${getMessage(arguments)}`);
}

module.exports = { info, warning, error };
