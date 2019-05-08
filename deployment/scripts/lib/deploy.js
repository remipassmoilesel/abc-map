const {commandSync, getCurrentGitSha} = require("./utils");

function buildDockerImage(config){
    commandSync("docker build . -t abc-map:" + getCurrentGitSha(config.paths.root), {cwd: config.paths.root});
}

function deploy(args, config) {
    buildDockerImage(config)
}

module.exports = {
    deploy
};
