
const path = require('path');
const recLaOptions = require('../nodejs-hook').httpsOptions;
var https = require('https');
var http = require('http');

// -- read the arguments
if (process.argv.length < 3) {
  exitWithTip('missing arguments');
}

var port = 4443;
var hostname = null;
if (process.argv[3]) {
  port = parseInt(process.argv[3], 10);
  if (isNaN(port) || (port < 1 || port > 65535)) {
    exitWithTip('second argument [' + process.argv[3] + '] is not a valid port number');
  }
}

var hostnameAndPort = process.argv[2].split(':');
var hostname = hostnameAndPort[0];
var hostport = hostnameAndPort[1] || 80;
if (isNaN(hostport) || (hostport < 1 || hostport > 65535)) {
  exitWithTip('host port [' + hostport + '] is not a valid port number');
}

https.createServer(recLaOptions, onRequest).listen(port);

function onRequest(client_req, client_res) {
  console.log('serve: ' + client_req.url);

  var options = {
    hostname: hostname,
    port: hostport,
    path: client_req.url,
    method: client_req.method,
    headers: client_req.headers
  };

  var proxy = http.request(options, function (res) {
    client_res.writeHead(res.statusCode, res.headers)
    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
}

function exitWithTip(tip) {
  console.error('Error: ' + tip +
    '\nUsage: ' + path.basename(process.argv[1]) + ' <hostname>[:port] [port to listen]');
  process.exit(0);
}

console.log('Rec-la proxy started on port ' + port + ' and serving http://' + hostname + ':' + hostport +
  '\nYou can open https://l.rec.la:' + port + '/');