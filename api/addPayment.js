const handler = require('./_reqhandler');
const { connect, models } = require('../db');

module.exports = handler(async ({ req, res, body }, done) => {
  await connect();
  const paydoc = new models.Payment(body);
  paydoc.save(err => {
    if (err) {
      console.error(err)
      res.statusCode = 404;
      return res.end('An error occurred when trying to save this payment');
    }

    res.writeHead(201, {'location': `${req.url}/${paydoc._id}`});
    res.end();
    done();
  });
});
