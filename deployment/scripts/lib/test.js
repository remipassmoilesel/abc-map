const {commandSync} = require("./utils");


function buildTest(path) {
    commandSync("npm run test:ci", {cwd: path});
}

function test(args, config) {
    buildTest(config.paths.shared);
    buildTest(config.paths.gui);
    buildTest(config.paths.api);
}

module.exports = {
    test
};
