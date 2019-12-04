const { writeFileSync } = require('fs');
const { spawn } = require('child_process');
const mongoUnit = require('mongo-unit');
const request = require('request-promise-native');


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
  const proc = spawn('npm', ['run', 'test:run']);
  proc.on('exit', (code) => {
    console.log(`[AVA] Exited with code: ${code}`);
    resolve(code);
  });
  proc.stdout.on('data', d => console.log(d.toString()));
  proc.stderr.on('data', d => console.error(d.toString()));
});

setup()
  .then(runTest)
  .then(async exitCode => {
    await teardown();
    process.exit(exitCode);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });