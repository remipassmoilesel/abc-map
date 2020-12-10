#!/usr/bin/env node

const {execSync} = require("child_process");
const path = require("path");

const Commands = {
  BOOSTRAP: "bootstrap",
  LINT: "lint",
  CLEAN_BUILD: "clean-build",
  TEST: "test",
  WATCH: "watch",
  CI: "ci",
  START: "start",
  STOP_SERVICES: "stop-services",
  CLEAN_RESTART_SERVICES: "clean-restart-services",
}

const projectRoot = path.resolve(__dirname, '..', '..')
const devServices = path.resolve(projectRoot, 'infrastructure', 'dev-services')

const arguments = process.argv;
main(arguments);

function main(args) {
  console.log("🌍 Abc-CLI 🔨")
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
  } else if (args.indexOf(Commands.START) !== -1) {
    start();
  } else if (args.indexOf(Commands.STOP_SERVICES) !== -1) {
    stopServices();
  } else if (args.indexOf(Commands.CLEAN_RESTART_SERVICES) !== -1) {
    cleanRestart();
  } else {
    console.error(`Invalid command: ${args.slice(2).join(" ")}`);
    console.error(`Try: ${Object.values(Commands).join(", ")}`);

    process.exit(1);
  }
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

function start() {
  exec("docker-compose up -d", {cwd: devServices});
  exec("lerna run start --parallel --no-bail");
}

function stopServices() {
  exec("docker-compose down", {cwd: devServices});
}

function cleanRestart() {
  exec("docker-compose down -v && docker-compose up -d", {cwd: devServices});
}

function exec(cmd, options) {
  const internalOpts = {
    stdio: 'inherit',
    cwd: projectRoot,
    ...options,
  };
  console.log(`Running: '${cmd}' with options ${JSON.stringify(internalOpts)}`);
  execSync(cmd, internalOpts);
}
