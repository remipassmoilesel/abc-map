#!/usr/bin/env node

const {execSync} = require("child_process");

const Commands = {
  BOOSTRAP : "bootstrap",
  LINT : "lint",
  CLEAN_BUILD : "clean-build",
  TEST : "test",
  WATCH : "watch",
  CI : "ci",
}

const arguments = process.argv;
main(arguments);

function main(args) {
  if (args.indexOf(Commands.BOOSTRAP) !== -1) {
    bootstrap();
  } else if (args.indexOf(Commands.LINT) !== -1) {
    lint();
  } else if (args.indexOf(Commands.CLEAN_BUILD) !== -1) {
    cleanBuild();
  } else if (args.indexOf(Commands.TEST) !== -1) {
    test();
  } else if (args.indexOf(Commands.WATCH) !== -1) {
    watch();
  } else if (args.indexOf(Commands.CI) !== -1) {
    bootstrap();
    lint();
    cleanBuild();
    test();
    console.log("Oh yeah 💪");
  } else {
    console.error(`Invalid command: ${args.slice(2).join(" ")}`);
    console.error(`Try: ${Object.values(Commands).join(", ")}`);

    process.exit(1);
  }
}

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

