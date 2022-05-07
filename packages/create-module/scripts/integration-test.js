const chalk = require('chalk');
const {execSync} = require('child_process');
const path = require('path');

const moduleName = `create-module-test-${require('uuid').v4()}`;

console.log(chalk.red('\n@abc-map/create-module integration test'))

const moduleApiRoot = path.resolve(__dirname, '..', '..', 'module-api');
const createModuleRoot = path.resolve(__dirname, '..');

exec(`npx -p ${createModuleRoot} create-module --name ${moduleName}`, {cwd: '/tmp'}, "Template failed");
exec("yarn link", {cwd: moduleApiRoot}, "Link failed");
exec("yarn link @abc-map/module-api", {cwd: `/tmp/${moduleName}`}, "Link failed");
exec("yarn run build", {cwd: `/tmp/${moduleName}`}, "Build failed");

console.log(`Passed 🍾`)

function exec(command, options, messageIfFail) {
  const cwd = options.cwd || createModuleRoot;
  try {
    console.log(chalk.red(`\n🔨 cwd=${cwd} $ ${command}\n`));
    execSync(command, {shell: true, stdio: 'inherit', ...options, cwd})
  } catch (err) {
    console.error(err);
    console.error(`\n${messageIfFail}\n`)
    process.exit(1);
  }
}
