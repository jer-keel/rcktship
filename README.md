# rcktship 🚀

Rcktship is a lightweight [node.js](https://nodejs.org/) library used for easily running a series of commands on both your local machine and remote hosts. This is an ideal library for small scale deployments.

Rcktship is heavily inspired by [Fabric](http://www.fabfile.org/), which is also a remote command runner written in Python.

## Usage

```bash
# Install rcktship CLI globally
$ npm install -g rcktship

# or in your project
$ npm install --save-dev rcktship

# Launch your first rocketship!
$ rocket <target> [mission] [options]

# or locally
$ ./node_modules/.bin/rocket <target> [mission] [options]
```

Rcktship will look for a top level `rcktship.js` file in your project, but you can explicitly define a config file by passing in --config <filepath>

The rocket **target** is the host, or list of hosts, that you wish to run the mission on. Targets are defined in your rcktship.js file.

A **mission** is analogous to a Fabric task, which is a predefined set of commands you wish to run.

You **must** provide a target for your rocket, but you do not have to provide a mission. If you do not provide a mission rcktship will look for a **default** mission.

## Sample `rcktship.js` file

```javascript
const rocket = require('rcktship');
const config = require('./config.json');

rocket.target('prod', config.connection);

rocket.mission('default', () => {
  console.log('Default mission!');
  rocket.remote('hostname');
});

rocket.mission('pwd', () => {
  rocket.local('pwd');
  rocket.remote('pwd');
});
```

To run the above missions:
```bash
# Run default task
$ rocket prod

# Run pwd task
$ rocket prod pwd
```

## Development

```bash
git clone git@github.com:jerkeeler/rcktship.git
npm install
npm start
```

Make any code changes, add tests, manually test your changes, then submit a pull request.

## Testing

```bash
npm test
```

Rcktship uses [jest](https://facebook.github.io/jest/) to do all testing and test coverage. Along with [ts-jest](https://github.com/kulshekhar/ts-jest) for the TypeScript support.
