const {execSync, exec} = require('child_process');

function commandAsync(command, options) {

    console.debug(command, JSON.stringify(options));

    const subprocess = exec(command, {
        cwd: options.cwd,
        stdio: options.stdio || 'inherit'
    });

    const wait = setInterval(function () {
    }, 1000);

    subprocess.stdout.on('data', (data) => process.stdout.write(data));
    subprocess.stderr.on('error', (err) => process.stderr.write(data));
    subprocess.on('exit', (data) => {
        console.log("Exit code: " + data);
        clearInterval(wait);
    });
}

function commandSync(command, options) {
    return execSync(command, {
        cwd: options.cwd,
        stdio: options.stdio || 'inherit'
    });
}

function getCurrentGitSha(path) {
    return execSync("git rev-parse HEAD", {cwd: path}).toString().substring(0,20);
}

module.exports = {
    commandAsync,
    commandSync,
    getCurrentGitSha
};
