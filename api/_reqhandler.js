const apidoc = require('../apidoc');

module.exports = (callback) => (req, res) => apidoc.then(openapi => {
  const oasRequest = { path: req.url, headers: req.headers, method: req.method };
  if (req.body) {
    oasRequest.body = req.body;
  }
  const [ value, error ] = openapi.request(oasRequest);
  if ( error ) {
    console.error(error);
    res.status(500);
    return res.send();
  }
  const { operation, path, query, body } = value;
  callback({ req, res, operation, path, query, body });
});
