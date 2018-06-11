# rec-la

Loopback domain and SSL certs. 

rec.la => 127.0.0.1**

`<any host name>.rec.la` points to `localhost`

# Why ?

At [Pryv](http://pryv.com) we often have to locally develop web applications that intensively use AJAX REST requests. CORS layer is enforced by pure HTTPS only policies from browsers.

This is why we refurbished a domain and its SSL certs to a full loopback domain.

This will enable any developer to benefit from a loopback signed Certificate.

# Usage

### ANY

Just download the certs from `src/` for any usage

**Files:** 

- rec.la-cert.crt : The certificate
- rec.la-key.pem : The key
- rec.la-ca.pem : Certificate of the authority
- rec.la-bundle.crt
: Bundle of key + ca

### From a node app

Execute:
`npm install rec-la --save`


**Pure node:**

```javascript  
var https = require('https');


var options = require('rec-la').httpsOptions;

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('hello world\n');
}).listen(8443);
```

**Express:**

```javascript
var https = require('https');
var express = require('express');
var app = express();

//...... Your code ....

var options = require('../nodejs-hook').httpsOptions;
https.createServer(options, app).listen(8443);

```

### WebServer

For your convenience we provide a small node.js server building.

Install: `npm install`  
Run: `node webserver/main.js <path> [port]`

Or install for command line usage with `npm install rec-la -g`  
Then you can call directly `$ rec-la <path> [port]`
