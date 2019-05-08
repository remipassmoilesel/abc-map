const {commandAsync} = require("./utils");

function startApi(args, config) {
    commandAsync("npm run watch", {cwd: config.paths.shared});
    commandAsync("npm run start", {cwd: config.paths.api});
}

function startGui(args, config) {
    commandAsync("npm run start", {cwd: config.paths.gui});
}

module.exports = {
    startApi,
    startGui
};
