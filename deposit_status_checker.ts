import fs from 'fs';
import { getBalance } from './ftx';

export { balanceLogger };

const config = {
  symbol: 'BTC',
  mock: true,
  mock_return: 0.03,
  trigger_threshold: 0.1,
};

const currentBalance = async (symbol = 'BTC') => {
  if (!config.mock) {
    const balances = await getBalance();
    let selectedBalance = null;
    balances.forEach((coin) => {
      if (coin[0] === symbol) {
        selectedBalance = coin[1];
      }
    });
    return selectedBalance;
  }
  return config.mock_return;
};

class Cache {
  static read = async (symbol: string) => {
    const cacheFilename = `.${symbol}`;
    return fs.readFileSync(cacheFilename, 'utf8');
  };

  static write = async (symbol: any, balance: string | NodeJS.ArrayBufferView) => {
    const cacheFilename = `.${symbol}`;
    fs.writeFileSync(cacheFilename, balance);
  };
}

const balanceLogger = async (symbol = 'BTC') => {
  const filename = `.${symbol}_log`;
  const balance = await currentBalance(symbol);
  const date = new Date().toISOString();
  const content = `${date} ${balance}\n`;

  fs.writeFileSync(filename, content, { flag: 'a+' });
};

const shouldTrigger = (
  balance: number,
  oldBalance: number,
  threshold: number,
) => (balance - oldBalance) > threshold;

const hasBeenDeposited = async () => {
  const balance = await currentBalance(config.symbol);
  const oldBalance = await Cache.read(config.symbol);
  return shouldTrigger(balance || 0, Number(oldBalance), config.trigger_threshold);
};

module.exports = { balanceLogger, hasBeenDeposited };
