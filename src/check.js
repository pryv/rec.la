const fs = require('fs');
const path = require('path');
const https = require('https');

const certsPath = path.resolve(__dirname, '../certs/');
const packPath = path.resolve(certsPath, 'pack.json');

function updateAndLoad (done) {
  try {
    const actual = load(' Auto updating ');
    if (actual != null && actual.expirationDays > 0) {
      return done(null, actual);
    }

    fetch(function (err, res) {
      if (err) return done(err);
      const expDays = expirationDays(res.info.notAfter);
      if (expDays < 0) {
        console.log('Downloaded rec.la certificate expired -- send an update request to tech@pryv.com');
        return done(null, actual);
      }

      fs.writeFileSync(path.resolve(certsPath, 'rec.la-bundle.crt'), res.cert + '\n' + res.ca);
      fs.writeFileSync(path.resolve(certsPath, 'rec.la-ca.crt'), res.ca);
      fs.writeFileSync(path.resolve(certsPath, 'rec.la-cert.crt'), res.cert);
      fs.writeFileSync(path.resolve(certsPath, 'rec.la-key.pem'), res.key);
      fs.writeFileSync(path.resolve(certsPath, 'pack.json'), JSON.stringify(res, null, 2));

      console.log('Updated rec.la certificate, expires in ' + expDays + ' days');
      res.expirationDays = expDays;
      return done(null, res);
    });
  } catch (e) {
    done(e);
  }
}

function fetch (done) {
  https.get('https://www.rec.la/pack.json', function (res) {
    let data = '';
    res.on('data', function (c) { data += c; });
    res.on('end', function () {
      try {
        return done(null, JSON.parse(data));
      } catch (e) {
        done(new Error('Invalid response ' + data));
      }
    });
  }).on('error', function (err) { done(err); });
}

function load (msgOnNeedUpdate) {
  if (!fs.existsSync(packPath)) {
    console.log('rec.la certificate not present. ' + msgOnNeedUpdate);
    return null;
  }
  const actual = JSON.parse(fs.readFileSync(packPath, 'utf-8'));
  actual.expirationDays = expirationDays(actual.info.notAfter);
  if (actual.expirationDays < 0) {
    console.log('rec.la certificate expired since ' + (-1 * actual.expirationDays) + ' days. ' + msgOnNeedUpdate);
  } else {
    console.log('rec.la certificate OK, expires in ' + actual.expirationDays + ' days');
  }
  return actual;
}

/**
 * @returns {number} - in days when the certificate expires (if negative it's expired)
 */
function expirationDays (stringDate) {
  const expireMs = new Date(stringDate).getTime() - Date.now();
  return Math.trunc(expireMs / (1000 * 60 * 60 * 24));
}

module.exports = {
  updateAndLoad,
  load
};
