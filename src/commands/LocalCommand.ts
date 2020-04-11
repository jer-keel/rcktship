import { Client } from 'ssh2';
import { AbstractCommand } from './AbstractCommand';
import { exec } from 'child_process';

class LocalCommand extends AbstractCommand {
  protected run(conns: Client[]): Promise<{}>[] {
    return [new Promise((resolve, reject) => {
      const cmdOut = exec(this.cmd);

      cmdOut.stdout.on('data', this.onData);
      cmdOut.stderr.on('data', this.onError);
      cmdOut.on('close', () => resolve('success'));
    })];
  }
}

export { LocalCommand };
