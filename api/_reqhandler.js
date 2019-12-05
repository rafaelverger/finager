const apidoc = require('../apidoc');
const finalhandler = require('finalhandler');

const readRequestBody = (request) => new Promise((resolve, reject) => {
  let body = [];
  request.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    if (request.headers['content-type'] === 'application/json') {
      body = JSON.parse(body);
    }
    resolve(body);
  }).on('error', (err) => {
    reject(err);
  });
});

module.exports = (callback) => (req, res) => apidoc.then(openapi => {
  const oasRequest = { path: req.url, headers: req.headers, method: req.method };
  readRequestBody(req)
    .then(requestBody => {
      if (requestBody) {
        oasRequest.body = requestBody;
      }
      const [ value, error ] = openapi.request(oasRequest);
      if ( error ) {
        console.error(error);
        res.statusCode = 500;
        return res.end();
      }
      const { operation, path, query, body } = value;
      callback({ req, res, operation, path, query, body }, finalhandler(req, res));
    })
});
