# rec-la

Loopback domain and SSL certs. 

**https://\<any hostname>.rec.la/ => https://localhost/**

`<any hostname>.rec.la` points to `localhost`

*Exception*: www.rec.la, a page to download the certificates. 

## Why ?

At [Pryv](http://pryv.com) we often have to locally develop web applications that intensively use AJAX REST requests.

Browsers inforce [Same-Origin Policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy) mechanism that restricts resources being loaded from another origin. This can be allowed, by sending correct [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) headers. 

Making requests to **HTTPS APIs** from **HTTP** sites on **localhost** would not be possible without changing security options on your browser.   

This is why we refurbished a domain and its SSL certs to a full loopback domain, se developpers cann benefit from a loopback signed Certificate.

## Update

From  `rec-la v0.2.*` certificates are not shipped with the npm package, but downloaded and updated regularly from [www.rec.la](https://www.rec.la).

Certificates will be checked and eventually refreshed at install and each time the packages is loaded. 

You can update the certs manually with `npm run update`

*Note*: If the certificates are **outdated** and loaded synchronously with  `require('rec-la').httpsOptions();` They will be updated and the service stoped, so it can be rebooted manually.

## Usage

### Command line

|                    | NPM                                    | Instaled with `-g`                  |
| ------------------ | -------------------------------------- | ----------------------------------- |
| Launch a webserver | `npm run webserver <directory> [port]` | `rec-la <directory> [port]`         |
| Launch a proxy     | `npm run proxy <host>:<port> <port>`   | `rec-la-proxy <host>:<port> <port>` |
| Update certs       | `npm run update`                       | `rec-la-update`                     |

### ANY

Just use the certificates in `certs/` or from [www.rec.la](https://www.rec.la) for any usage

**Files:** 

- rec.la-cert.crt : The certificate
- rec.la-key.pem : The key
- rec.la-ca.pem : Certificate of the authority
- rec.la-bundle.crt : Bundle of key + ca
- pack.json : All this packed in a json file 

### From a node app

Execute:
`npm install rec-la --save`

##### Pure node:

```javascript  
var https = require('https');

var options = require('rec-la').httpsOptions();

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8443);
```

###### or (check and update before):

```javascript  
var https = require('https');

var httpsOptionsAsync = require('rec-la').httpsOptionsAsync;

httpsOptionsAsync(function (err, httpsOptions) {
  https.createServer(httpsOptions, (req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8443);
});
```



##### Express:

```javascript
var https = require('https');
var express = require('express');
var app = express();

//...... Your code ....

var httpsOptionsAsync = require('../nodejs-hook').httpsOptionsAsync;

httpsOptionsAsync(function (err, httpsOptions) {
	https.createServer(httpsOptions, app).listen(8443);
}

```

##### Vue.js:

Enable local https for **Vue.js** development

```javascript
const recLaOptions = require('rec-la').httpsOptions();
recLaOptions.https = true;
recLaOptions.host = 'l.rec.la';

module.exports = {
  // your options
  // ...
  devServer: recLaOptions
};
```

Now `vue-cli-service serve` will be served under `https://l.rec.la`

### WebServer

For your convenience we provide a small node.js server building.

Install: `npm install`  
Run: `node webserver/main.js <path> [port]`

Or install for command line usage with `npm install rec-la -g`  
Then you can call directly `$ rec-la <path> [port]`

### Proxy 

You can also use it as a reverse proxy to convert https => http calls. 

Examples: 
  - from the repository `npm run proxy localhost:3000` to proxy `https://l.rec.la:4443` => `http://localhost:3000`
  - If install with `npm install rec-la -g`, do `$ rec-la-proxy <hostname>:[port] [local port]`

