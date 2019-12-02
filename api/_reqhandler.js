const apidoc = require('../apidoc');

module.exports = (callback) => (req, res) => apidoc.then(openapi => {
  const result = openapi.path(req.method.toLowerCase(), req.url);
  if ( result.error ) {
    console.error(result.error);
    res.status(500);
    return res.send();
  }
  const [{ operation, params }] = result;
  callback({ req, res, operation, params });
});
