import { RemoteCommand } from '../RemoteCommand';
import { ConnectionFactory } from '../../ConnectionFactory';
import { Client } from 'ssh2';

const connectionFactory = new ConnectionFactory();
let conns: Client[];

beforeEach(async () => {
  conns = [
    await connectionFactory.create({}),
    await connectionFactory.create({})
  ];
});

test('RemoteCommand should contain correct command', () => {
  const cmd = new RemoteCommand('pwd');
  expect(cmd.cmd).toEqual('pwd');
});

test('RemoteCommand should execute safely', async () => {
  const cmd = new RemoteCommand('pwd');
  const output = await Promise.all(cmd.execute(conns));
  output.forEach(promise => expect(promise).toBe('success'));
});

test('RemoteCommand should execute on both connections', async () => {
  const cmd = new RemoteCommand('pwd');
  const output = await Promise.all(cmd.execute(conns));
  expect(output.length).toEqual(2);
});

test('RemoteCommand should execute on just one connection', async () => {
  const cmd = new RemoteCommand('pwd', true);
  const output = await Promise.all(cmd.execute(conns));
  expect(output.length).toEqual(1);
});
