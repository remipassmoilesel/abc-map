const {commandSync, getCurrentGitSha} = require("./utils");

function buildDockerImage(config){
    commandSync("docker build . -t abc-map:" + getCurrentGitSha(config.paths.root), {cwd: config.paths.root});
}

function ansiblePlaybook(args, config) {
    const ansibleArgs = args.slice(1).join(" ");
    commandSync("ansible-playbook -i inventory.cfg playbook.yml " + ansibleArgs, {cwd: config.paths.ansible});
}

function deploy(args, config) {
    if(args.indexOf("--build") !== -1){
        buildDockerImage(config)
    }

    ansiblePlaybook(args, config)
}

module.exports = {
    deploy
};
