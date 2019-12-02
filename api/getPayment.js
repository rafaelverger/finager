const apidoc = require('../apidoc');

module.exports = (req, res) => {
  apidoc.then(openapi => {
    const result = openapi.path(req.method.toLowerCase(), req.url);
    console.log(result);
    if ( result.error ) {
      console.log(result);
      res.status(500);
      return res.send('');
    }

    const [{ operation, params }] = result;
    res.send(params);
  });
}