import { RocketFactory } from '../RocketFactory';
import * as chalk from 'chalk';

const colors = chalk.default;

const rocketFactory = new RocketFactory();
const rocket = rocketFactory.create();

beforeEach(() => {
  rocket.reset();
});

test('Should add new local command to queue', () => {
  expect(rocket.commands).toHaveLength(0);
  rocket.local('pwd');
  expect(rocket.commands).toHaveLength(1);
});

test('Should add new remote command to queue', () => {
  expect(rocket.commands).toHaveLength(0);
  rocket.remote('pwd');
  expect(rocket.commands).toHaveLength(1);
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
  rocket.target('prod', []);
  expect(rocket.targets['prod']).toBeDefined();
});

test('Should run set of local commands', async () => {
  rocket.mission('default', () => {
    rocket.local('pwd');
    rocket.local('hostname');
  });

  const output = await rocket.liftoff('local');
  expect(output).toEqual(true);
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

test('Using with should add', () => {
  expect(rocket.prependArgs).toHaveLength(0);
  rocket.with('cd /test', () => {
    expect(rocket.prependArgs).toHaveLength(1);
  });
  expect(rocket.prependArgs).toHaveLength(0);
});
