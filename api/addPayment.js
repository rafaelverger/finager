const handler = require('./_reqhandler');
const { connect, models } = require('../db');

module.exports = handler(async ({ req, res, body }) => {
  await connect();
  const paydoc = new models.Payment(body);
  paydoc.save(err => {
    if (err) {
      console.error(err)
      res.status(500);
      return res.send('An error occurred when trying to save this payment');
    }

    res.setHeader('location', `${req.url}/${paydoc._id}`)
    res.status(201);
    res.send();
  });
});
