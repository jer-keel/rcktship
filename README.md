# rcktship 🚀

Rcktship is a lightweight Node library used for easily running a series of commands on both your local machine and remote hosts. This is an ideal library for small scale deployments.

## Usage

rcktship reads your rcktship.js file. Then from the command line run
```
rcktship <target>
```
which will run your commands sequentially on any host you specify.

Example `rcktship.js` file
```
const rocket = require('rcktship');
const config = require('./config.json');

rocket.target('prod', config.connection);
rocket.local('pwd');
rocket.remote('pwd');
```


## Development Setup

Clone this repository.
```
npm install
npm start
```
