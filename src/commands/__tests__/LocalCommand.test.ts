import { LocalCommand } from '../LocalCommand';
import { ConnectionFactory } from '../../ConnectionFactory';

const connectionFactory = new ConnectionFactory();

test('LocalCommand should contain correct command', () => {
  const cmd = new LocalCommand('pwd');
  expect(cmd.cmd).toEqual('pwd');
});

test('LocalCommand should execute pwd cleanly', async () => {
  const cmd = new LocalCommand('pwd');
  const output = await Promise.all(cmd.execute([await connectionFactory.create({})]));
  output.forEach(out => expect(out).toEqual('success'));
});
