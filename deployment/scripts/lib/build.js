const {commandSync} = require("./utils");


function buildModule(path) {
    commandSync("npm install && npm run clean && npm run build", {cwd: path});
}

function lintModule(path) {
    commandSync("npm run lint", {cwd: path});
}

function build(args, config) {
    buildModule(config.paths.shared);
    buildModule(config.paths.api);
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
