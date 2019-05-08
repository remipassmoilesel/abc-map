const {commandSync, getCurrentGitSha} = require("./utils");

function databaseStart(args, config) {
    commandSync("docker-compose up -d", {cwd: config.paths.databases});
}

function databaseStop(args, config) {
    commandSync("docker-compose down", {cwd: config.paths.databases});
}

function databaseClean(args, config) {
    commandSync(`sudo rm -rf ${config.paths.databases}/data`, {cwd: config.paths.databases});
}

module.exports = {
    databaseStart,
    databaseStop,
    databaseClean
};
