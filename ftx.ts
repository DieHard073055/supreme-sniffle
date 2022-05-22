import 'dotenv/config';
import https from 'https';
import { BinaryLike, createHmac } from 'crypto';
import { URL } from 'url';

export { getBalance, getBtcPrice };

const { API_SECRET } = process.env;
const { API_KEY } = process.env;

const generateHmac = (signaturePayload: BinaryLike) => createHmac('sha256', API_SECRET || '')
  .update(signaturePayload)
  .digest('hex');

const generateHeaders = (
  ts: any,
  method: string,
  path: any,
  rqPayload: string | NodeJS.ArrayBufferView | ArrayBuffer | SharedArrayBuffer,
) => {
  let signaturePayload = '';
  if (method === 'POST') {
    signaturePayload = `${ts}${method}${path}${rqPayload}`;
    return {
      'FTX-KEY': API_KEY,
      'FTX-SIGN': generateHmac(signaturePayload),
      'FTX-TS': `${ts}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(rqPayload),
    };
  }
  signaturePayload = `${ts}${method}${path}`;
  return {
    'FTX-KEY': API_KEY,
    'FTX-SIGN': generateHmac(signaturePayload),
    'FTX-TS': `${ts}`,
  };
};

const generateOptions = (ts: number, method: string, path: string, payload: string) => ({
  headers: generateHeaders(ts, method, path, payload),
  method,
  hostname: 'ftx.com',
  port: 443,
  path,
});

const httpsRequest = async (
  options: string | https.RequestOptions | URL,
  payload: string,
) => new Promise((resolve, reject) => {
  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      data = JSON.parse(data);
      resolve(data);
    });
  }).on('error', (err) => {
    reject(err);
  });
  if (payload) { req.write(payload); }
  req.end();
});

const getBtcPrice = async () => {
  const ts = Date.now();
  const path = '/api/markets/BTC/USD';
  const method = 'GET';
  const options = generateOptions(ts, method, path, '');
  return httpsRequest(options, '')
    .then((price) => price.result)
    .catch(console.error);
};

const getBalance = async () => {
  const ts = Date.now();
  const path = '/api/wallet/all_balances';
  const method = 'GET';
  const options = generateOptions(ts, method, path, '');
  const balances: any[][] = [];
  await httpsRequest(options, '')
    .then((response) => {
      response.result.main.forEach((coin: { [x: string]: any; }) => {
        balances.push([coin.coin, coin.availableForWithdrawal]);
      });
    })
    .catch(console.error);
  return balances;
};

const placeOrder = async (market: any, side: any, price: any, size: any) => {
  const ts = Date.now();
  const path = '/api/orders';
  const method = 'POST';
  const rqPayload = JSON.stringify({
    market,
    side,
    price,
    size,
    type: 'limit',
    reduceOnly: false,
    ioc: false,
    postOnly: true,
    clientId: null,
  });

  const options = generateOptions(ts, method, path, rqPayload);

  httpsRequest(options, rqPayload)
    .then(console.log)
    .catch(console.error);
};

module.exports = {
  placeOrder, getBalance, getBtcPrice,
};
