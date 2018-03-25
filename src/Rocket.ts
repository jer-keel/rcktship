import { Client, ConnectConfig } from 'ssh2';
import { readFileSync } from 'fs';
import * as chalk from 'chalk';
const colors = chalk.default;

import { AbstractCommand } from './commands/AbstractCommand';
import { LocalCommand } from './commands/LocalCommand';
import { RemoteCommand } from './commands/RemoteCommand';
import { ConnectionFactory } from './ConnectionFactory';


class Rocket {
  currentTarget: string;
  commands: AbstractCommand[] = [];
  connections: Client[] = [];
  targets: { [target: string]: ConnectConfig[] } = {};
  missions: { [name: string]: Function } = {};
  prependArgs: string[] = [];

  constructor(private connectionFactory: ConnectionFactory) { }

  /**
   * Add a new target that the rocket can use to execute commands on
   *
   * @param target The name of the target
   * @param connectionConfigs Connections for each host this target should hit
   */
  target(target: string, connectionConfigs: ConnectConfig[]) {
    this.targets[target] = connectionConfigs;
  }

  /**
   * Run a command on all remote hosts in the target
   *
   * @param cmd Command to run remotely
   */
  remote(cmd: string) {
    cmd = this.composeCmd(cmd);
    const remoteCmd = new RemoteCommand(cmd);
    return this.executeCommand(remoteCmd);
  }

  /**
   * Run a command locally, once
   *
   * @param cmd Command to run locally
   */
  local(cmd: string) {
    cmd = this.composeCmd(cmd);
    const localCmd = new LocalCommand(cmd);
    return this.executeCommand(localCmd);
  }

  /**
   * Create a new mission with a particular name that executes a callback
   * containing javascript and commands to run
   *
   * @param name Name of the mission
   * @param callback Function to call when executing a mission
   */
  mission(name: string, callback: Function) {
    this.missions[name] = callback;
  }

  /**
   * Reset all internal attributes, commands, missions, and targets
   */
  reset() {
    this.commands = [];
    this.missions = {};
    this.targets = {};
  }

  /**
   * Prepend all commands inside of a given callback with a given command
   *
   * @param command Command to prepend to all commands executed in the callback
   * @param callback Callback containing commands to execute
   */
   with(command: string, callback: Function): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        this.prependArgs.push(command);
        const results = await callback();
        this.prependArgs.pop();
        resolve(results);
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  }

  /**
   * Make the rocket liftoff! And run all commands sequentially!
   *
   * @param target Target to use when executing commands
   * @param mission Missions to run on the selected target, default is 'default'
   */
  async liftoff(target: string, mission = 'default') {
    if (!this.missions[mission]) {
      throw new Error(`${colors.redBright('Mission')}` +
                      ` ${colors.greenBright.bold(`${mission}`)} ` +
                      `${colors.redBright('was not found!')}`);
    }

    if (!this.targets[target] && target !== 'local') {
      throw new Error(`${colors.redBright('Target')}` +
                      ` ${colors.greenBright.bold(`${target}`)} ` +
                      `${colors.redBright('was not found!')}`);
    }

    const targetConfig = this.targets[target];
    this.currentTarget = target;
    if (targetConfig) {
      console.log(colors.blue.bold('Client::ready'));
      this.connections = await this.connectionFactory.createAll(targetConfig);
    }

    await this.missions[mission]();

    if (targetConfig) {
      await this.connectionFactory.terminateAll(this.connections);
      console.log(colors.blue.bold('\nClient::end'));
    }

    return true;
  }

  private async executeCommand(command: AbstractCommand) {
    return new Promise(async (resolve, reject) => {
      let commandExecutions: Promise<object>[] = [];
      commandExecutions.push(...command.execute(this.connections));
      await Promise.all(commandExecutions);
      resolve();
    });
  }

  private composeCmd(cmd: string): string {
    const prepend = this.prependArgs.join(' && ');
    if (this.prependArgs.length > 0)
      cmd = prepend + ' && ' + cmd;
    return cmd;
  }
}

export { Rocket };
