# rec-la

Loopback domain and SSL certs. 

*SSL cert is valid up to the 12th June 2017 -- will be updated before expiration*

***.rec.la => 127.0.0.1**  
`<any host name>.rec.la` points to `localhost`

# Why ?

At [Pryv](http://pryv.com) we often often have to locally develop web applications that intensively
uses AJAX rest requests. CORS layer is enforced by pure HTTPS only policies from browsers.

This is why we refurbished a domain and its SSL certs to a full loopback domain.

This will enable any devlopper to benefit from a loopback signed Certificate.

# Usage

### ANY

Just download the certs from `src/` for any usage

**Files:** 

- rec.la-cert.crt : The certificate
- rec.la-key.pem : The key
- rec.la-ca.pem : Certificate of the authority
- rec.la-bundle.crt	: Bundle of key + ca				
### WebServer

For you convenience we provide a small node.js server building.

Install: `npm install`
Run: `node webserver/main.js <path> [port]`



