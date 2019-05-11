const {commandSync} = require("./utils");


function buildModule(path) {
    commandSync("npm install && npm run build", {cwd: path});
}

function build(args, config) {
    buildModule(config.paths.shared);
    buildModule(config.paths.api);
    buildModule(config.paths.gui);
}

module.exports = {
    build
};
