const { writeFileSync } = require('fs');
const { spawn } = require('child_process');
const mongoUnit = require('mongo-unit');
const request = require('request-promise-native');


const [_, __, reportFileDest] = process.argv;

/**
 * This setup/teardown file should not exist and those steps should be handled
 * by AVA itself, but when I was trying to run AVA's Before hook asynchronously
 * it avoid the execution of its After hook
 */

let SERVER;
const startDevServer = (serverLocation) => {
  console.log('Starting dev server...');
  SERVER = spawn('now', ['dev', '--listen', serverLocation]);
  SERVER.on('exit', (code) => {
    console.log(`[DEV_SERVER] Exited with code: ${code}`);
  });
  SERVER.stdout.on('data', (data) => {
    console.log(`[DEV_SERVER] ${data}`);
  });
  SERVER.stderr.on('data', (data) => {
    console.error(`[DEV_SERVER] ${data}`);
  });
}

const checkDevServer = (url, attempts = 15) => {
  console.log(`[DEBUG] Checking ${url} // attempts left: ${--attempts} ...`);
  return request
    .head(url)
    .catch(err => {
      if (attempts === 0) {
        console.error(err);
        throw err;
      }
      return new Promise(r => setTimeout(() => r(checkDevServer(url, attempts)), 500));
    });
}

const setup = async () => {
  const serverLocation = '127.0.0.1:5000';
  process.env.DEV_SERVER = `http://${serverLocation}`;
  console.log('Starting mongo...');
  await mongoUnit.start();
  writeFileSync('./.env', `MONGO_URI=${mongoUnit.getUrl()}`);
  startDevServer(serverLocation);
  return checkDevServer(process.env.DEV_SERVER)
    .then(() => console.log('Setup completed.'));
};

const teardown = async () => {
  console.log('Stopping mongo...')
  await mongoUnit.stop();
  console.log('Stopping dev server...');
  spawn('kill', ['-INT', SERVER.pid]);
  console.log('Teardown completed.');
};

const runTest = () => new Promise((resolve) => {
  let cmd = 'test:run';
  if (reportFileDest) {
    console.log(`Test report file destination: ${reportFileDest}`);
    cmd = `${cmd}:tap`;
  }
  let output = '';
  const proc = spawn('npm', ['run', cmd]);
  proc.on('exit', (code) => {
    console.log(`[AVA] Exited with code: ${code}`);
    if (reportFileDest) writeFileSync(reportFileDest, output);
    resolve(code);
  });
  proc.stderr.on('data', d => console.error(d.toString()));
  proc.stdout.on('data', d => {
    output += d;
    console.log(d.toString())
  });
});

setup()
  .then(runTest)
  .catch(err => {
    console.error(err);
    return 1;
  })
  .then(async exitCode => {
    await teardown();
    process.exit(exitCode);
  });