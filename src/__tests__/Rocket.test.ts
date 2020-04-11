import { RocketFactory } from '../RocketFactory';
import * as colors from 'chalk';

const rocketFactory = new RocketFactory();
const rocket = rocketFactory.create();

beforeEach(() => {
  rocket.reset();
});

test('Should return new promise for local command', () => {
  const promise = rocket.local('pwd');
  expect(promise).not.toBe(null);
});

test('Should add new remote command to queue', () => {
  const promise = rocket.remote('pwd');
  expect(promise).not.toBe(null);
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

test('Using with should prepend arguments', async () => {
  expect(rocket.prependArgs).toHaveLength(0);
  await rocket.with('cd /test', () => {
    expect(rocket.prependArgs).toHaveLength(1);
  });
  expect(rocket.prependArgs).toHaveLength(0);
});

test('JustOnce should flip once to true', async () => {
  expect(rocket.once).toBe(false);
  await rocket.justOnce(() => {
    expect(rocket.once).toBe(true);
  })
  expect(rocket.once).toBe(false);
});
