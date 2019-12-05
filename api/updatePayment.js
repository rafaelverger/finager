const handler = require('./_reqhandler');
const { connect, models } = require('../db');

module.exports = handler(async ({ res, path, body }, done) => {
  await connect();
  const paydoc = await models.Payment.findOne({ _id: path.id });
  if ( !paydoc ) {
    res.statusCode = 404;
    return res.end();
  }

  Object.entries(body).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      paydoc.attributes[key] = { ...paydoc.attributes[key], ...value };
    } else {
      paydoc.attributes[key] = value;
    }
  });
  await paydoc.save();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(paydoc));
  done();
});
