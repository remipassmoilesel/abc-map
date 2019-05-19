const {commandSync} = require("./utils");


function install(path) {
    commandSync("npm install", {cwd: path});
}

function installShared(path) {
    commandSync("npm install ../shared", {cwd: path});
}

function buildModule(path) {
    commandSync("npm run clean && npm run build", {cwd: path});
}

function lintModule(path) {
    commandSync("npm run lint", {cwd: path});
}

function build(args, config) {
    install(config.paths.shared);
    buildModule(config.paths.shared);

    installShared(config.paths.api);
    install(config.paths.api);
    buildModule(config.paths.api);

    installShared(config.paths.api);
    install(config.paths.api);
    buildModule(config.paths.gui);
}

function lint(args, config) {
    lintModule(config.paths.shared);
    lintModule(config.paths.api);
    lintModule(config.paths.gui);
}

module.exports = {
    build,
    lint
};
