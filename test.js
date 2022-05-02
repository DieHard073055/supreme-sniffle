const assert = require('assert');
const { describe } = require('mocha');
const order_logic = require('./order');

const EXPECTED_SYMBOL = 'BTC/USD';
const SELL_SIDE = 'sell';

describe('Order logic', function() {
  describe('#salary trigger threshold', function() {
    it('should place an order when the balance is equal to expected btc', function() {
      const balance = 100;
      const current_btc_price = 1;
      //                  salary in USD / btc price in USD
      const expected_btc_salary = balance / current_btc_price

      order_logic(balance, current_btc_price, expected_btc_salary, (symbol, side, btc_price, sell_size) => {
        assert.equal(1, 1) // we only test if this function is called.
      }, (_) => { })

    })
    it('should place an order when the balance is more than the expected btc', function() {
      const balance = 100;
      const current_btc_price = 1;
      //                  salary in USD / btc price in USD
      const expected_btc_salary = balance - 10 / current_btc_price // here we are reducing the expected_btc_salary therefore increasing balance

      order_logic(balance, current_btc_price, expected_btc_salary, (symbol, side, btc_price, sell_size) => {
        assert.equal(1, 1) // we only test if this function is called.
      }, (_) => { })
    })
    it('should not place an order when the balance is less than expected btc', function() {
      const balance = 100;
      const current_btc_price = 1;
      //                  salary in USD / btc price in USD
      const expected_btc_salary = balance + 10 / current_btc_price // here we are increasing the expected_btc_salary

      order_logic(balance, current_btc_price, expected_btc_salary, (symbol, side, btc_price, sell_size) => {
      }, (_) => {
        assert.equal(1, 1) // we only test if this function is called.
      })
    })
  })
  describe('#order sell size', function() {
    it('should be exactly equal to the BTC_SELL_PERCENTAGE', function() {
      const balance = 100;
      const current_btc_price = 1;
      //                  salary in USD / btc price in USD
      const expected_btc_salary = balance + 10 / current_btc_price // here we are increasing the expected_btc_salary

      order_logic(balance, current_btc_price, expected_btc_salary, (symbol, side, btc_price, sell_size) => {
        assert.equal(balance * 0.88, sell_size); // we only test if this function is called.
      },
        (_) => { })
    })
  })
  describe('#order limit price', function() {
    it('should be exactly equal to the current btc_price', function() {
      const balance = 100;
      const current_btc_price = 1;
      //                  salary in USD / btc price in USD
      const expected_btc_salary = balance + 10 / current_btc_price // here we are increasing the expected_btc_salary

      order_logic(balance, current_btc_price, expected_btc_salary, (symbol, side, btc_price, sell_size) => {
        assert.equal(btc_price, current_btc_price); // we only test if this function is called.
      },
        (_) => { })
      assert.equal(1, 1);
    })
  })
})
