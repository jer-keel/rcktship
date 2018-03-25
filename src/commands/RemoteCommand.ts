import { Client } from 'ssh2';

import { AbstractCommand } from './AbstractCommand';

class RemoteCommand extends AbstractCommand {
  protected run(conns: Client[]): Promise<{}>[] {
    const promises: Promise<{}>[] = [];
    conns.forEach(conn => {
      promises.push(new Promise((resolve, reject) => {
        conn.exec(this.cmd, (err, stream) => {
          stream
          .on('close', () => resolve('success'))
          .on('data', this.onData)
          .stderr.on('data', this.onError);
        });
      }));
    });
    return promises;
  }
}

export { RemoteCommand };
