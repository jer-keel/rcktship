const rocket = require('./index');
const config = require('./config.json');

rocket.target('prod', config.connection);

rocket.mission('default', () => {
  console.log('Default mission!');
  console.log(`Current target: ${rocket.currentTarget}`);
  rocket.remote('hostname');
});

rocket.mission('pwd', () => {
  rocket.local('pwd');
  rocket.remote('pwd');
});
