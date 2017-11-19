#!/usr/bin/env node

const Liftoff   = require('liftoff');
const v8flags   = require('v8flags');
const path      = require('path');
const interpret = require('interpret');
const nopt      = require('nopt');
const cliPack   = require('../package.json');

const knownOptions = {
  'config': path,
  'version': Boolean,
  'help': Boolean,
};

const shortHands = {
  'c': ['--config'],
  'v': ['--version'],
  'h': ['--help'],
};

const options = nopt(knownOptions, shortHands, process.argv2, 2);

if (options.help) {
  process.stdout.write(
    '\n' +
    '  Usage: rocket <target> [mission] [options]\n\n' +
    '  Options:\n' +
    '    -v, --version rcktship version\n' +
    '    -h, --help  How to use rcktship\n' +
    '\n\n'
  );
  process.exit(0);
}

if (options.version) {
  process.stdout.write(`rcktship version: ${cliPack.version}\n`);
  process.exit(0)
}

const target = options.argv.remain[0];
let mission = options.argv.remain[1];

if (!target) {
  process.stderr.write('No target was specified!\n');
  process.exit(1);
}

if (!mission) {
  mission = 'default';
}

const cli = new Liftoff({
  name: 'rcktship',
  configName: 'rcktship',
  modulename: 'rcketship',
  extensions: interpret.jsVariants,
  v8flags: v8flags,
});

async function invoke(env) {
  process.chdir(env.configBase);

  if (options.config) env.configPath = options.config;

  require(env.configPath);
  const rcktship = await require(env.modulePath);
  rcktship.liftoff(target, mission).catch((err) => console.error(err));
}

cli.launch({}, invoke);
