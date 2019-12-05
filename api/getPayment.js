const handler = require('./_reqhandler');
const { connect, models } = require('../db');

module.exports = handler(async ({ res, path }, done) => {
  await connect();
  const paydoc = await models.Payment.findOne({ _id: path.id });
  if ( !paydoc ) {
    res.statusCode = 404;
    return res.end();
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(paydoc));
  done();
});
