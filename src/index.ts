import { RocketFactory } from './RocketFactory';
import { Rocket } from './Rocket';

const rocketFactory = new RocketFactory();
const rckt: Rocket = rocketFactory.create();

export { rckt };
