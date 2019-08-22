const chalk = require('chalk');
const log = require('./log');

module.exports = (deprecated, correct) =>
  log.warning(
    `${deprecated ? chalk.hex('#eb6161')(deprecated) : 'Command'} will be deprecated.`,
    correct ? `Please switch to ${chalk.green(correct)} command.` : '',
  );
