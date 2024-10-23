const fs = require("fs");
const rsaPemToJwk = require('rsa-pem-to-jwk');

const privateKey = fs.readFileSync("../certs/private.pem").toString("binary");
const g = privateKey + "\n"

const jwk = rsaPemToJwk(g, { use: 'sig' }, 'public');
console.log(jwk);
