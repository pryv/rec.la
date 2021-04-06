const fs = require('fs');
const path = require('path');
const cert2json = require('cert2json');


/**
 * @returns {number} - in days when the certificate expires (if negative it's expired)
 */
function expirationDays() { 
  const pem = fs.readFileSync(path.resolve(__dirname, '../src/rec.la-cert.crt'));
  const cert = cert2json.parse(pem);
  const expireMs = cert.tbs.validity.notAfter.getTime() - Date.now();
  return Math.trunc(expireMs / (100 * 60 * 60 * 24)) / 10;
}

/**
 * Add to console an "Expire in message" or "expired message"
 */
function expirationMessageToConsole() {
  const expireInDays = expirationDays();
  if (expireInDays > 0) {
    console.log('Rec-la SSL certificate expires in ' + expireInDays + ' days.')
  } else {
    console.error('Rec-la SSL certificate expired since ' + (expireInDays * -1) + ' days. Update package: "npm upgrade rec-la" or "yarn upgrade rec-la"')
  }
}


module.exports = {
  expirationDays,
  expirationMessageToConsole
}