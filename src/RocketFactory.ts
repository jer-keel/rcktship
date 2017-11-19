import { Rocket } from './Rocket';
import { ConnectionFactory } from './ConnectionFactory';

class RocketFactory {
  create(): Rocket {
    const connectionFactory = new ConnectionFactory();
    return new Rocket(connectionFactory);
  }
}

export { RocketFactory };
