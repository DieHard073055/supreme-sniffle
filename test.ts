import assert from 'assert';
import { describe } from 'mocha';
import order_logic from './order';

const EXPECTED_SYMBOL = 'BTC/USD';
const SELL_SIDE = 'sell';

describe('Order logic', () => {
  describe('#salary trigger threshold', () => {
    it('should place an order when the balance is equal to expected btc', () => {
      const balance = 100;
      const current_btcPrice = 1;
      //                  salary in USD / btc price in USD
      const expected_btc_salary = balance / current_btcPrice;

      order_logic(balance, current_btcPrice, expected_btc_salary, (_symbol: any, _side: any, _btcPrice: any, _sell_size: any) => {
        assert.ok(true); // we only test if this function is called.
      }, (_: any) => { assert.fail(); });
    });
    it('should place an order when the balance is more than the expected btc', () => {
      const balance = 100;
      const current_btcPrice = 1;
      //                  salary in USD / btc price in USD
      const expected_btc_salary = balance - 10 / current_btcPrice; // here we are reducing the expected_btc_salary therefore increasing balance

      order_logic(balance, current_btcPrice, expected_btc_salary, (_symbol: any, _side: any, _btcPrice: any, _sell_size: any) => {
        assert.ok(true); // we only test if this function is called.
      }, (_: any) => { assert.fail(); });
    });
    it('should not place an order when the balance is less than expected btc', () => {
      const balance = 100;
      const current_btcPrice = 1;
      //                  salary in USD / btc price in USD
      const expected_btc_salary = balance + 10 / current_btcPrice; // here we are increasing the expected_btc_salary

      order_logic(balance, current_btcPrice, expected_btc_salary, (_symbol: any, _side: any, _btcPrice: any, _sell_size: any) => {
        assert.fail();
      }, (_: any) => {
        assert.ok(true); // we only test if this function is called.
      });
    });
  });
  describe('#order sell size', () => {
    it('should be exactly equal to the BTC_SELL_PERCENTAGE', () => {
      const balance = 100;
      const current_btcPrice = 1;
      //                  salary in USD / btc price in USD
      const expected_btc_salary = balance + 10 / current_btcPrice; // here we are increasing the expected_btc_salary

      order_logic(
        balance,
        current_btcPrice,
        expected_btc_salary,
        (_symbol: any, _side: any, _btcPrice: any, sell_size: unknown) => {
          assert.equal(balance * 0.88, sell_size);
        },
        (_: any) => { console.log; },
      );
    });
  });
  describe('#order limit price', () => {
    it('should be exactly equal to the current btcPrice', () => {
      const balance = 100;
      const current_btcPrice = 1;
      //                  salary in USD / btc price in USD
      const expected_btc_salary = balance + 10 / current_btcPrice; // here we are increasing the expected_btc_salary

      order_logic(
        balance,
        current_btcPrice,
        expected_btc_salary,
        (_symbol: any, _side: any, btcPrice: unknown, _: any) => {
          assert.equal(btcPrice, current_btcPrice);
        },
        (_: any) => { console.log; },
      );
    });
  });
});
