import config from './config';

const BTC_SELL_PERCENTAGE = config.test.my.btc_sell_percentage;
// const BTC_TO_SATOSHI = 100000000;
// const SALARY_VOLATILITY_MITIGATION_AMOUNT = config.test.my.salary_volatility_mitigation_perctage;
const SALARY_TRIGGER_THRESHOLD = config.test.my.salary_trigger_threshold;

module.exports = (
  balance: number,
  btcPrice: any,
  expected_btc: number,
  placeOrder: (
    arg0: string,
    arg1: string,
    arg2: any,
    arg3: number) => void,
  err: (arg0: string) => void,
) => {
  if (balance + SALARY_TRIGGER_THRESHOLD >= expected_btc) {
    // place order
    const sellBtcSize = BTC_SELL_PERCENTAGE * balance;
    placeOrder('BTC/USD', 'sell', btcPrice, sellBtcSize);
  } else {
    // err
    err('btc balance is below threshold');
  }
};
