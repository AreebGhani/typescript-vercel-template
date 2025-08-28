import os from 'os';
import { execSync } from 'child_process';

import figlet from 'figlet';
import chalk from 'chalk';
import gradient from 'gradient-string';

const main = () => {
  console.log('\n');
  figlet('template', async (_err, data) => {
    if (data !== undefined) {
      const coloredText = gradient.rainbow(data);
      console.log(chalk.green(coloredText));
      console.log(chalk.white.bold('\n💻 System Information:'));
      console.log(chalk.gray('----------------------'));
      // System Information
      console.log(chalk.gray('OS Platform:'), os.platform());
      console.log(chalk.gray('OS Release:'), os.release());
      console.log(chalk.gray('OS Type:'), os.type());
      console.log(chalk.gray('Hostname:'), os.hostname());
      console.log(chalk.gray('Architecture:'), os.arch());
      // CPU Information
      const cpus = os.cpus();
      console.log(chalk.gray('CPU Cores:'), cpus.length);
      console.log(chalk.gray('CPU Model:'), cpus[0].model);
      console.log(chalk.gray('CPU Speed (MHz):'), cpus[0].speed);
      // Memory Information
      console.log(chalk.gray('Total Memory:'), `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`);
      console.log(chalk.gray('----------------------\n'));
    }

    const NODE_ENV = process.env.NODE_ENV || 'Unknown';
    try {
      if (NODE_ENV === 'development') {
        console.log(chalk.cyan('Starting in development mode...\n'));
        execSync(`([ ! -d ./docs/dist ] && npm run build:docs || true) && nodemon`, {
          stdio: 'inherit',
        });
      } else if (NODE_ENV === 'production') {
        console.log(chalk.yellow('Starting in production mode...\n'));
        execSync(
          `([ ! -d ./docs/dist ] && npm run build:docs || true) && \
           cross-env NODE_PATH="$(node scripts/path.js)" NODE_ENV=production \
           node --experimental-specifier-resolution=node ./build/src/index.js`,
          { stdio: 'inherit' }
        );
      } else {
        console.log(chalk.red(`NODE_ENV: ${NODE_ENV}`));
      }
    } catch (error) {
      console.log(chalk.red('❌ Failed to start the process\n'));
      process.exit(1);
    }
  });
};

main();
