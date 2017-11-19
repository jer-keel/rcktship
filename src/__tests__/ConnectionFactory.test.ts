import { ConnectionFactory } from '../ConnectionFactory';

const connectionFactory = new ConnectionFactory();

test('Should create a new connection and terminate it', async () => {
  const connection = await connectionFactory.create({});
  expect(connection).toBeDefined();
  connectionFactory.terminate(connection);
  expect(connection.end).toHaveBeenCalled();
});

test('Should create multiple new connections', async () => {
  const connections = await connectionFactory.createAll([{}, {}, {}]);
  expect(connections).toBeDefined();
  expect(connections).toHaveLength(3);
  connectionFactory.terminateAll(connections);
  for (let connection of connections) {
    expect(connection.end).toHaveBeenCalled();
  }
});
