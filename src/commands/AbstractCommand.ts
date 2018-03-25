import { Client } from 'ssh2';
import * as chalk from 'chalk';
const colors = chalk.default;

abstract class AbstractCommand {
  constructor(readonly cmd: string) { }

  protected abstract run(conn: Client[]): Promise<{}>[];

  execute(conn: Client[]): Promise<{}>[] {
    const now = new Date();
    console.log(colors.cyanBright.bold(`\n${now} - Executing ${this.constructor.name}: ${this.cmd}`));
    return this.run(conn);
  }

  protected onData(data: string) {
    console.error(colors.greenBright(`${data.toString().trim()}`));
  }

  protected onError(data: string) {
    console.error(colors.redBright(`ERROR: ${data.toString().trim()}`));
  }
}

export { AbstractCommand };
