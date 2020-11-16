#!/usr/bin/env node

const {execSync} = require("child_process");


function main(args) {
  if (args.indexOf("bootstrap") !== -1) {
    bootstrap();
  } else if (args.indexOf("lint") !== -1) {
    lint();
  } else if (args.indexOf("clean-build") !== -1) {
    cleanBuild();
  } else if (args.indexOf("test") !== -1) {
    test();
  } else if (args.indexOf("watch") !== -1) {
    watch();
  } else if (args.indexOf("ci") !== -1) {
    bootstrap();
    lint();
    cleanBuild();
    test();
    console.log("Oh yeah 💪");
  }
}

const arguments = process.argv;
main(arguments);

function exec(cmd) {
  execSync(cmd, {
    stdio: 'inherit'
  });
}

function bootstrap() {
  exec("lerna bootstrap");
}

function lint() {
  exec("lerna run lint");
}

function cleanBuild() {
  exec("lerna run clean-build");
}

function test() {
  exec("lerna run test");
}

function watch() {
  exec("lerna run watch --parallel");
}

