const rocket = require('./index');
const config = require('./config.json');

rocket.target('prod', config.connection);
rocket.local('pwd');
rocket.remote('pwd');
// rocket.liftoff();
