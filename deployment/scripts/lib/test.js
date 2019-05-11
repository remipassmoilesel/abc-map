const {commandSync} = require("./utils");


function testModule(path) {
    commandSync("npm run test:ci", {cwd: path});
}

function test(args, config) {
    testModule(config.paths.shared);
    testModule(config.paths.gui);
    testModule(config.paths.api);
}

module.exports = {
    test
};
