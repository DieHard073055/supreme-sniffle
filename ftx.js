const https = require('https');
const {
  createHmac
} = require('crypto');
require('dotenv').config();

const API_SECRET = process.env.API_SECRET
const API_KEY = process.env.API_KEY

const generate_hmac = (signature_payload) => {
  return createHmac('sha256', API_SECRET)
    .update(signature_payload)
    .digest('hex');
}

const generate_headers = (ts, method, path, rq_payload) => {
  let signature_payload = '';
  if (method == 'POST') {
    signature_payload = `${ts}${method}${path}${rq_payload}`
    return {
      "FTX-KEY": API_KEY,
      "FTX-SIGN": generate_hmac(signature_payload),
      "FTX-TS": `${ts}`,
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(rq_payload),
    }
  }
  signature_payload = `${ts}${method}${path}`
  return {
    "FTX-KEY": API_KEY,
    "FTX-SIGN": generate_hmac(signature_payload),
    "FTX-TS": `${ts}`,
  }
}

const generate_options = (ts, method, path, payload) => {
  return {
    headers: generate_headers(ts, method, path, payload),
    method: method,
    hostname: "ftx.com",
    port: 443,
    path: path,
  }
}

const https_request = async (options, payload) => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      })
      res.on('end', () => {
        data = JSON.parse(data);
        resolve(data);
      })
    }).on('error', err => {
      reject(err);
    });
    if (payload)
      req.write(payload);
    req.end();
  });
}

const get_btc_price = async () => {
  const ts = Date.now();
  const path = '/api/markets/BTC/USD';
  const method = 'GET';
  const options = generate_options(ts, method, path, null);
  let btc_price = null;
  await https_request(options, null)
    .then(price => btc_price = price["result"])
    .catch(console.error)
  return btc_price;
}

const get_balance = async () => {
  const ts = Date.now();
  const path = '/api/wallet/all_balances';
  const method = 'GET';
  const options = generate_options(ts, method, path, null);
  let balances = [];
  await https_request(options, null)
    .then(response => {
      response.result.main.forEach(coin => {
        balances.push([coin['coin'], coin['availableForWithdrawal']])
      })
    })
    .catch(console.error)
  return balances
}

const place_order = async (market, side, price, size) => {
  const ts = Date.now();
  const path = '/api/orders'
  const method = 'POST'
  const rq_payload = JSON.stringify({
    "market": market,
    "side": side,
    "price": price,
    "size": size,
    "type": "limit",
    "reduceOnly": false,
    "ioc": false,
    "postOnly": true,
    "clientId": null
  })

  const options = generate_options(ts, method, path, rq_payload);

  https_request(options, rq_payload)
    .then(console.log)
    .catch(console.error);
}


module.exports = { place_order, get_balance, get_btc_price }
