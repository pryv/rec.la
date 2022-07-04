# rec.la

[![npm](https://img.shields.io/npm/v/rec.la)](https://www.npmjs.com/package/rec.la) [![License](https://img.shields.io/badge/License-BSD_3--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)

Loopback domain and SSL certificates:

**https://\<any subdomain>.rec.la/ → https://localhost/**

Any subdomain of `rec.la` points to `localhost`!

**Exception:** `www.rec.la`, which points to a page where you can download the certificates.


## Why ?

At [Pryv](http://pryv.com) we often have to locally develop web applications that intensively use AJAX REST requests.

Browsers enforce the [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) mechanism that restricts the loading of resources from another origin. This can be allowed by sending correct [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) headers.

But making requests to **HTTPS APIs** from **HTTP** sites on **localhost** would not be possible without changing security options on your browser, which is why we refurbished a domain and its SSL certificates as a full loopback domain, to let anyone benefit from a signed certificate on **localhost**.


## Update: where are the certificates?

From v0.2 onwards, certificates are not bundled with the npm package, but downloaded and updated from [www.rec.la](https://www.rec.la) at installation and runtime, or manually with `rec.la-update`.

Note: If the certificates are outdated and loaded synchronously with  `require('rec.la').httpsOptions()` (see usage below), they will be updated and the service stopped, so it can be rebooted manually.


## Usage

### Installation

```
npm install rec.la
```

### Command line

(Don't forget to prefix commands with `npx` if not installed globally.)

Start a webserver serving the contents of a directory on `https://l.rec.la:<port>/`:

```
rec.la <path> [<port>]
```

Start a proxy on `https://l.rec.la:<port>/`:

```
rec.la-proxy <target host>[:<target port>] [<port>]
```

Manually update the certificates:

```
rec.la-update
```

### Certificate files

You can also directly use the certificates files on [www.rec.la](https://www.rec.la):

- `rec.la-cert.crt`: The certificate
- `rec.la-key.pem`: The private key
- `rec.la-ca.pem`: Certificate of the authority
- `rec.la-bundle.crt`: Bundle of key + CA
- `pack.json`: All the above in a JSON file

### From a node app

#### Pure Node.js

```js
const https = require('https');
const options = require('rec.la').httpsOptions();

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8443);
```

Or (check and update before):

```js
const https = require('https');
const httpsOptionsAsync = require('rec.la').httpsOptionsAsync;

httpsOptionsAsync(function (err, httpsOptions) {
  https.createServer(httpsOptions, (req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8443);
});
```

#### Express

```js
const https = require('https');
const httpsOptionsAsync = require('rec.la').httpsOptionsAsync;
const express = require('express');
const app = express();

// ...your code...

httpsOptionsAsync(function (err, httpsOptions) {
  https.createServer(httpsOptions, app).listen(8443);
});
```

#### Vue.js

Enable local HTTPS for development:

```js
const recLaOptions = require('rec.la').httpsOptions();
recLaOptions.https = true;
recLaOptions.host = 'l.rec.la';

module.exports = {
  // ...your options...
  devServer: recLaOptions
};
```

Now `vue-cli-service serve` will be served on `https://l.rec.la`


## Contributing

`npm run start` starts the webserver (see `rec.la` CLI command above)

`npm run proxy` starts the proxy (see `rec.la-proxy` CLI command above)

`npm run lint` lints the code with [Semi-Standard](https://github.com/standard/semistandard).

Pull requests are welcome.


## License

[BSD-3-Clause](LICENSE.md)
