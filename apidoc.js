const Enforcer = require('openapi-enforcer');
const projectOAS = require('./openapi.json');

const prom = Enforcer.dereference(projectOAS).then((deReferencedOAS) => {
  const [ openapi ] = Enforcer.v3_0.OpenApi(deReferencedOAS);
  return openapi;
});
module.exports = prom;