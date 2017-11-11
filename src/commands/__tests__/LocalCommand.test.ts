import { LocalCommand } from '../LocalCommand';

test('LocalCommand should contain correct command', () => {
  const cmd = new LocalCommand('pwd');
  expect(cmd.cmd).toEqual('pwd');
});

test('LocalCommand should execute pwd cleanly', async () => {
  const cmd = new LocalCommand('pwd');
  const output = await cmd.execute();
  expect(output).toEqual('success');
});
