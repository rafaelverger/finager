const handler = require('./_reqhandler');
const { connect, models } = require('../db');

module.exports = handler(async ({ res, query }, done) => {
  await connect();
  const condition = query.organisation_id ? { organisation_id: query.organisation_id } : {};
  const payments = await models.Payment
    .find(condition)
    .limit(query.limit || 10)
    .skip(query.skip || 0)
    .sort({ _id: 'asc', 'attributes.processing_date': 'asc' })
    .exec();
  
  res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(payments));
  done();
});
