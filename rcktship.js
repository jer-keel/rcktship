const rocket = require('./index');
const config = require('./config.json');

rocket.target('prod', [config.connection]);
rocket.target('prod2', [config.connection, config.connection])

rocket.mission('default', () => {
  console.log('Default mission!');
  console.log(`Current target: ${rocket.currentTarget}`);
  rocket.remote('hostname');
});

rocket.mission('pwd', () => {
  rocket.remote('pwd');
  rocket.remote('hostname');
});

rocket.mission('with', () => {
  rocket.with('cd /app', () => {
    rocket.with('cd /', () => {
      rocket.remote('pwd');
    })
    rocket.remote('pwd');
  });
  rocket.remote('pwd');
});
