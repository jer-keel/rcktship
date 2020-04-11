const rocket = require('./dist/index').default;
const config = require('./config.json');

rocket.target('prod', [config.connection]);
rocket.target('prod2', [config.connection, config.connection]);

rocket.mission('default', async () => {
  console.log('Default mission!');
  console.log(`Current target: ${rocket.currentTarget}`);
  await rocket.local('pwd');
  await Promise.all([
    rocket.remote('hostname'),
    rocket.remote('pwd'),
  ]);
});

rocket.mission('pwd', async () => {
  await rocket.local('pwd');
  await rocket.remote('echo \'hello world!\'');
});

rocket.mission('with', async () => {
  await rocket.with('cd /apps', async () => {
    await rocket.with('cd /', async () => {
      await rocket.remote('pwd');
    });
    await rocket.remote('pwd');
  });
  await rocket.remote('pwd');
  await rocket.with('cd ./src', async () => {
    await rocket.local('pwd');
  });
});

rocket.mission('once', async () => {
  await rocket.remote('hostname');
  await rocket.justOnce(async () => {
    await rocket.remote('hostname')
  });
});
