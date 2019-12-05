const handler = require('./_reqhandler');
const { connect, models } = require('../db');

module.exports = handler(async ({ res, path }, done) => {
  await connect();
  await models.Payment
    .deleteOne({ _id: path.id })
    .then(({ ok, deletedCount, n }) => {
      const status = ok && deletedCount > 0 ? 204 : 404;
      res.writeHead(status).end();
    })
    .catch(err => {
      res.writeHead(500).end(err.message);
    })
    .then(done);
});
