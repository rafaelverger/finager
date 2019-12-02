const apidoc = require('../apidoc');
const { connect, models } = require('../db');

module.exports = (req, res) => {
  apidoc.then(async openapi => {
    const result = openapi.path(req.method.toLowerCase(), req.url);
    if ( result.error ) {
      res.status(500);
      return res.send();
    }

    const [{ params }] = result;
    await connect();
    const paydoc = await models.Payment.findOne({ _id: params.id });
    if ( !paydoc ) {
      res.status(404);
      return res.send();
    }

    res.json(paydoc);
  });
}
