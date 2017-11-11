import { RemoteCommand } from '../RemoteCommand';

test('RemoteCommand should contain correct command', () => {
  const cmd = new RemoteCommand('pwd');
  expect(cmd.cmd).toEqual('pwd');
});
