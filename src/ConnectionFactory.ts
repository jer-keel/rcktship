import { Client, ConnectConfig } from 'ssh2';
import { readFileSync } from 'fs';
import { connect } from 'net';

class ConnectionFactory {
  create(config: ConnectConfig): Promise<Client> {
    config = Object.assign({}, config);
    if (config.privateKey)
      config.privateKey = readFileSync(config.privateKey);
    return new Promise<Client>((resolve, reject) => {
      let connection = new Client();
      connection.on('ready', () => {
        resolve(connection);
      }).connect(config);
    })
  }

  createAll(configs: ConnectConfig[]): Promise<Client[]> {
    return new Promise<Client[]>(async (resolve, reject) => {
      const connections: Client[] = [];
      for (const config of configs) {
        connections.push(await this.create(config));
      }
      resolve(connections);
    });
  }

  terminate(connection: Client) {
    connection.end();
  }

  terminateAll(connections: Client[]) {
    for (let connection of connections) {
      this.terminate(connection);
    }
  }
}

export { ConnectionFactory };
