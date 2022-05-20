const fs = require('fs')
const { _, get_balance } = require('./ftx');

const config = {
  symbol: 'BTC',
  mock: true,
  mock_return: 0.03,
  trigger_threshold: 0.1,
}

const current_balance = async (symbol = 'BTC', mock = false) => {
  if (!config.mock) {
    const balances = await get_balance();
    let selected_balance = null
    balances.forEach(coin => {
      if (coin[0] == symbol) {
        selected_balance = coin[1]
      }
    })
    return selected_balance
  }
  return config.mock_return
}

class Cache {
  static read = async (symbol) => {
    const cache_filename = `.${symbol}`;
    return fs.readFileSync(cache_filename, 'utf8');
  }

  static write = async (symbol, balance) => {
    const cache_filename = `.${symbol}`;
    fs.writeFileSync(cache_filename, balance);
  }
}

const balance_logger = async (symbol = 'BTC') => {
  const filename = `.${symbol}_log`;
  const balance = await current_balance(symbol);
  const date = new Date().toISOString();
  const content = `${date} ${balance}\n`;

  fs.writeFileSync(filename, content, { flag: 'a+' });
}

const should_trigger = (balance, old_balance, threshold) => {
  return (balance - old_balance) > threshold;
}

const has_been_deposited = async () => {
  const balance = await current_balance(config.symbol);
  const old_balance = await Cache.read(config.symbol);
  return should_trigger(balance, old_balance, config.trigger_threshold);
}

module.exports = { balance_logger, has_been_deposited }

