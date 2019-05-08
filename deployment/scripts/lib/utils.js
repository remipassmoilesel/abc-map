const {execSync} = require('child_process');

function commandSync(command, options) {
    execSync(command, {
        cwd: options.cwd,
        stdio: 'inherit'
    });
}

module.exports = {
    commandSync
};
