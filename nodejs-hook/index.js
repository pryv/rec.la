var fs = require('fs');

module.exports = {
  httpsOptions : {
    key: fs.readFileSync(__dirname + '/../src/rec.la-key.pem'),
    cert: fs.readFileSync(__dirname + '/../src/rec.la-cert.crt'),
    ca: fs.readFileSync(__dirname + '/../src/rec.la-ca.pem')
  }
};