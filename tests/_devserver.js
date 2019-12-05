const http = require('http');
const Router = require('router');
const finalhandler = require('finalhandler');
const request = require('request-promise-native');
const nowConfig = require('../now.json');

const startDevServer = (port) => {
  console.debug('Starting dev server...');
  
  // Routes
  const router = Router();
  router.head('/', (_, res) => res.end(''));

  nowConfig.routes.forEach(routeConfig => {
    // Ignore wildcard rules
    if (routeConfig.dest.includes("$")) return;

    const handlerPath = '..' + routeConfig.dest;
    const handler = require(handlerPath);

    // Ignore static routes
    if ( !(handler instanceof Function) ) return;

    // routeConfig.src contains real regex string and Router expect paths like: /path/:param
    const routePath = routeConfig.src.replace(/\(\?<([^>]+)>[^\)]*\)/g, ':$1');
    (routeConfig.methods || ['all']).forEach(method => {
      router[method.toLowerCase()](routePath, handler);
    });
  });

  // Start server
  const server = http.createServer(function (req, res) {
    console.debug(`[DEV SERVER] Request[${req.method}] received at ${req.url}`);
    router(req, res, finalhandler(req, res));
  });
  server.listen(port, () => {
    console.debug(`[DEV SERVER] Running on port ${port}`);
  });

  return () => new Promise(res => server.close(res));
}

const checkDevServer = (url, attempts = 15) => {
  console.debug(`[DEBUG] Checking ${url} // attempts left: ${--attempts} ...`);
  return request
    .head(url)
    .catch(err => {
      if (attempts === 0) {
        console.error(err);
        throw err;
      }
      return new Promise(r => setTimeout(() => r(checkDevServer(url, attempts)), 500));
    });
}

module.exports = async () => {
  const serverPort = 8001;
  const serverUrl = `http://127.0.0.1:${serverPort}`;
  const closeServer = startDevServer(serverPort);
  return checkDevServer(serverUrl)
    .then(() => {
      console.debug('Server started!');
      return [closeServer, serverUrl];
    });
};