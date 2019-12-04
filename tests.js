const test = require('ava');

const { writeFileSync } = require('fs');
const { spawn } = require('child_process');
const mongoUnit = require('mongo-unit');
const request = require('request-promise-native');

// test setup
test.before(async t => {
  console.log(1);
  const serverLocation = '127.0.0.1:5000';
  const mongoUrl = await mongoUnit.start().then(m => { console.log('mongoUrl', m); return m; });
  console.log(mongoUrl);
  writeFileSync("./.env", `MONGO_URI=${mongoUrl}`);
  const now = spawn('now', ['dev', '-e', `MONGO_URI=${mongoUrl}`, '--listen', serverLocation]);
  t.context = { now, serverUrl: `http://${serverLocation}` };

  const checkServer = () => {
    const url = t.context.serverUrl;
    // console.log(`Checking ${url} ...`);
    return request
      .head(url)
      .then(console.log)
      .catch(checkServer);
  }
  await checkServer();
  console.log(10);
});

test.after.always('guaranteed cleanup', async t => {
  await mongoUnit.stop();
  now.kill();
});


test.todo('assert empty list');

test.todo('assert POST -- serial');
test.serial('assert GET -- serial', t => {
  t.pass();
});
test.todo('assert PATCH -- serial');
test.todo('assert GET UPDATED -- serial');
test.todo('assert DELETE -- serial');
test.todo('assert GET not found -- serial');

test.todo('assert POST -- rand doc x 3');
test.todo('assert existing list -- serial');
test.todo('assert existing list paginated -- serial');
