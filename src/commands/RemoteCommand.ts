import { Client } from 'ssh2';

import { AbstractCommand } from './AbstractCommand';

class RemoteCommand extends AbstractCommand {
  constructor(
    cmd: string,
    private once: boolean = false
  ) {
    super(cmd);
  }

  protected run(conns: Client[]): Promise<any>[] {
    const promises: Promise<{}>[] = [];
    if (this.once) {
      promises.push(this.runOnConnection(conns[0]));
    } else {
      conns.forEach(conn => { promises.push(this.runOnConnection(conn)); });
    }
    return promises;
  }

  private runOnConnection(conn: Client): Promise<any> {
    return new Promise((resolve, reject) => {
      conn.exec(this.cmd, (err, stream) => {
        stream
        .on('close', () => resolve('success'))
        .on('data', this.onData)
        .stderr.on('data', this.onError);
      });
    })
  }
}

export { RemoteCommand };
