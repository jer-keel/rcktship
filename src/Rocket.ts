import { Client, ConnectConfig } from 'ssh2';
import { readFileSync } from 'fs';
import * as chalk from 'chalk';
const colors = chalk.default;

import { AbstractCommand } from './commands/AbstractCommand';
import { LocalCommand } from './commands/LocalCommand';
import { RemoteCommand } from './commands/RemoteCommand';

class Rocket {
  cmds: AbstractCommand[] = [];
  conn: Client;
  targets: { [target: string]: ConnectConfig } = {};

  target(target: string, rocketConfig: ConnectConfig) {
    if (rocketConfig && rocketConfig.privateKey)
      rocketConfig.privateKey = readFileSync(rocketConfig.privateKey);
    this.targets[target] = rocketConfig;
  }

  remote(cmd: string) {
    const remoteCmd = new RemoteCommand(cmd);
    this.addToQueue(remoteCmd);
  }

  local(cmd: string) {
    const localCmd = new LocalCommand(cmd);
    this.addToQueue(localCmd);
  }

  async liftoff(target: string) {
    const targetConfig = this.targets[target];
    if (targetConfig) {
      this.conn = new Client();
      this.conn.on('ready', async () => {
        console.log(colors.blue.bold('Client::ready\n'));
        await this.runCmds();
        this.conn.end();
        console.log(colors.blue.bold('Client::end'));
      }).connect(targetConfig);
    } else {
      await this.runCmds();
    }
  }

  private addToQueue(cmd: AbstractCommand) {
    this.cmds.push(cmd);
  }

  private async runCmds() {
    return new Promise(async (resolve, reject) => {
      for (let cmd of this.cmds) {
        try {
          await cmd.execute(this.conn);
        } catch (err) {
          console.error(colors.redBright.bold(`Failed executing command: ${cmd.cmd}`));
          console.error(colors.redBright(err));
        }
      }
      return resolve();
    });
  }
}

export { Rocket };
