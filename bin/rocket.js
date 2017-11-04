#!/usr/bin/env node

const Liftoff   = require('liftoff');
const v8flags   = require('v8flags');
const interpret = require('interpret');
const nopt      = require('nopt');

const knownOptions = {
  'help': Boolean,
};

const shortHands = {
  'h': ['--help'],
};

const options = nopt(knownOptions, shortHands, process.argv2, 2);
const target = options.argv.remain[0];

const cli = new Liftoff({
  name: 'rcktship',
  configName: 'rcktship',
  modulename: 'rcketship',
  extensions: interpret.jsVariants,
  v8flags: v8flags,
});

function invoke(env) {
  process.chdir(env.configBase);
  require(env.configPath);
  const rcktship = require(env.modulePath);
  rcktship.liftoff(target);
}

cli.launch({}, invoke);
