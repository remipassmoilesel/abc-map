const {commandSync, getCurrentGitSha} = require("./utils");

function databaseStart(args, config) {
    commandSync("docker-compose restart abcmap-mongodb abcmap-minio", {cwd: config.paths.databases});
}

function databaseStop(args, config) {
    commandSync("docker-compose stop abcmap-mongodb abcmap-minio", {cwd: config.paths.databases});
}

function databaseClean(args, config) {
    commandSync(`sudo rm -rf ${config.paths.databases}/data`, {cwd: config.paths.databases});
}

module.exports = {
    databaseStart,
    databaseStop,
    databaseClean
};
