var https = require('https');
var path = require('path');
var fs = require('fs');

var express = require('express');
var app = express();



var options = {
  key: fs.readFileSync(__dirname + '/../src/rec.la-key.pem'),
  cert: fs.readFileSync(__dirname + '/../src/rec.la-cert.crt'),
  ca: fs.readFileSync(__dirname + '/../src/rec.la-ca.pem')
};


// -- read the arguments
if (process.argv.length < 3) {
  exitWithTip('missing arguments');
}
var path = path.resolve(path.normalize(process.argv[2]));
if (! fs.existsSync(path) || ! fs.lstatSync(path).isDirectory()) {
  exitWithTip('[' + path + '] is not existing or not a directory ');
}

var port = 4443;
if (process.argv[3]) {
  port = parseInt(process.argv[3], 10);
  if ((isNaN(process.argv[3])) || (port < 1 || port > 65535)) {
    exitWithTip('second argument [' + process.argv[3] + '] is not a valid port number');
  }
}

// -- launch server

// Tiny middleware to allow CORS (cross-domain) requests to the API.
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Serve static files
app.use(express.static(path));

// Custom error messages
app.use(function (req, res) {
  res.status(400).send('No such static file! ' + req.url + ' <br> Server by <B>rec.la</B> ' +
  '<A HREF="https://github.com/pryv/rec-la">https://github.com/pryv/rec-la</A>');
});



https.createServer(options, app).listen(port);
console.log('Rec-la server started on port ' + port + ' and serving path: ' + path +
  '\nYou can open https://l.rec.la:' + port + '/');


function exitWithTip(tip) {
  console.error('Error: ' + tip + '\nUsage: node webserver/main.js <path> [port]');
  process.exit(0);
}
