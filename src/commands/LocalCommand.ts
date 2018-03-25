import { Client } from 'ssh2';
import { AbstractCommand } from './AbstractCommand';
import { spawn } from 'child_process';

class LocalCommand extends AbstractCommand {
  protected run(conns: Client[]): Promise<{}>[] {
    const args = this.cmd.split(' ');
    const origCmd = args[0];
    args.shift();
    return [new Promise((resolve, reject) => {
      const cmdOut = spawn(origCmd, args);

      cmdOut.stdout.on('data', this.onData);
      cmdOut.stderr.on('data', this.onError);
      cmdOut.on('close', () => resolve('success'));
    })];
  }
}

export { LocalCommand };
