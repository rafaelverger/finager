const { writeFileSync } = require('fs');
const { spawn } = require('child_process');
const mongoUnit = require('mongo-unit');

const [_, __, reportFileDest] = process.argv;

/**
 * This setup/teardown file should not exist and those steps should be handled
 * by AVA itself, but when I was trying to run AVA's Before hook asynchronously
 * it avoid the execution of its After hook
 */


let closeDevServer;
const startDevServer = require('./_devserver');
const setup = async () => {
  if (!process.env.MONGO_URI) {
    console.log('Starting mongo...');
    await mongoUnit.start();
    mongoUnit.__started = true;
    process.env.MONGO_URI = mongoUnit.getUrl();
  }
  return startDevServer()
    .then(([stopServer, serverUrl]) => {
      closeDevServer = stopServer;
      process.env.DEV_SERVER = serverUrl;
      console.log('Setup completed.')
    });
};

const teardown = async () => {
  if (mongoUnit.__started) {
    console.log('Stopping mongo...')
    await mongoUnit.stop();
  }
  console.log('Stopping dev server...');
  await closeDevServer().then(() => console.log('Teardown completed.'));
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
    if (reportFileDest) {
      const xmlOutput = output.substring(output.indexOf('<?xml version="1.0"?>'));
      writeFileSync(reportFileDest, xmlOutput);
    }
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