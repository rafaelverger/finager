const handler = require('./_reqhandler');
const { connect, models } = require('../db');

module.exports = handler(async ({ res, params }) => {
  await connect();
  const paydoc = await models.Payment.findOne({ _id: params.id });
  if ( !paydoc ) {
    res.status(404);
    return res.send();
  }
  res.json(paydoc);
});
