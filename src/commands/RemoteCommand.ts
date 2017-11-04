import { Client } from 'ssh2';

import { AbstractCommand } from './AbstractCommand';

class RemoteCommand extends AbstractCommand {
  protected run(conn: Client) {
    return new Promise((resolve, reject) => {
      conn.exec(this.cmd, (err, stream) => {
        stream
          .on('close', () => resolve())
          .on('data', this.onData)
          .stderr.on('data', this.onError);
      });
    });
  }
}

export { RemoteCommand };
