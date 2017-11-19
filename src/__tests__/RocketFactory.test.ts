import { RocketFactory } from '../RocketFactory';

const rocketFactory = new RocketFactory();

test('Should create a new rocket', () => {
  const rocket = rocketFactory.create();
  expect(rocket).toBeDefined();
});
