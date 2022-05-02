const config = require('./config');
const BTC_SELL_PERCENTAGE = config.test.my.btc_sell_percentage;
const BTC_TO_SATOSHI = 100000000
const SALARY_VOLATILITY_MITIGATION_AMOUNT = config.test.my.salary_volatility_mitigation_perctage;
const SALARY_TRIGGER_THRESHOLD = config.test.my.salary_trigger_threshold;

module.exports = (balance, btc_price, expected_btc, place_order, err) => {

  if (balance + SALARY_TRIGGER_THRESHOLD >= expected_btc) {
    // place order
    const sell_btc_size = BTC_SELL_PERCENTAGE * balance;
    place_order("BTC/USD", "sell", btc_price, sell_btc_size);
  } else {
    // err
    err("btc balance is below threshold");
  }

}
