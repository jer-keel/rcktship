import { Rocket } from '../Rocket';
import * as chalk from 'chalk';

const colors = chalk.default;

const rocket = new Rocket();

beforeEach(() => {
  rocket.reset();
});

test('Should add new local command to queue', () => {
  expect(rocket.cmds).toHaveLength(0);
  rocket.local('pwd');
  expect(rocket.cmds).toHaveLength(1);
});

test('Should add new remote command to queue', () => {
  expect(rocket.cmds).toHaveLength(0);
  rocket.remote('pwd');
  expect(rocket.cmds).toHaveLength(1);
});

test('Should add a new mission', async () => {
  expect(rocket.missions['testMission']).toBeUndefined();
  rocket.mission('testMission', () => {
    rocket.local('pwd');
  });
  expect(rocket.missions['testMission']).toBeDefined();
});

test('Should add a new target', () => {
  expect(rocket.targets['prod']).toBeUndefined();
  rocket.target('prod', {});
  expect(rocket.targets['prod']).toBeDefined();
});

test('Should run set of local commands', async () => {
  rocket.mission('default', () => {
    rocket.local('pwd');
    rocket.local('hostname');
  });

  const output = await rocket.liftoff('local');
  expect(output).toEqual('success');
});

test('Should throw error if target is not registered', async () => {
  const expected = new Error(`${colors.redBright('Target')}` +
                             ` ${colors.greenBright.bold('fakeTarget')} ` +
                             `${colors.redBright('was not found!')}`);
  rocket.mission('default', () => {});
  try {
    await rocket.liftoff('fakeTarget');
  } catch (err) {
    expect(err).toEqual(expected);
  }
});

test('Should throw error if mission is not registered', async () => {
  const expected = new Error(`${colors.redBright('Mission')}` +
                             ` ${colors.greenBright.bold('fakeMission')} ` +
                             `${colors.redBright('was not found!')}`);
  try {
    await rocket.liftoff('fakeTarget', 'fakeMission');
  } catch (err) {
    expect(err).toEqual(expected);
  }
});
