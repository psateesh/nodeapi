/* eslint-disable no-console */

var chalk = require('chalk');
var ip = require('ip');

/**
 * Logger middleware, you can customize it to make messages more personal
 */
var logger = {
  // Called whenever there's an error on the server we want to print
  error: (err) => {
    console.error(chalk.red(err));
  },

  // Called when express.js app starts on given port w/o errors
  appStarted: (port, host) => {
    console.log(
      chalk.cyan(
        '----------------------------------------------------------------------------------',
      ),
    );
    console.log(chalk.yellow('Task:'), chalk.blue('Starting Server'));
    console.log(
      chalk.cyan(
        '----------------------------------------------------------------------------------',
      ),
    );
    console.log(`Server started ! ${chalk.green('✓')}`);

    console.log(`${chalk.bold('Access URLs:')}
Localhost: ${chalk.magenta(`http://${host}:${port}`)}
      LAN: ${chalk.magenta(`http://${ip.address()}:${port}`)}
${chalk.blue(`Press ${chalk.italic('CTRL-C')} to stop`)}
    `);
  },
};

module.exports = logger;
