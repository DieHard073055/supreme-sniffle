module.exports = {
  production: {
    blockchain: {
      api: 'https://blockchain.info/',
      active_balance: 'balance?active=',
    },
    my: {
      salary_usd: 100,
      salary_volatility_mitigation_perctage: 0.03,
      salary_trigger_threshold: 0.01,
      btc_sell_percentage: 0.88,
      btc_wallet: '1Fq38FA9XNqMZCptvdxfKEiESk9ZapYYLN',
    },
    ftx: { markets: 'https://ftx.com/api/markets' },
  },
  test: {
    my: {
      salary_volatility_mitigation_perctage: 0.03,
      salary_trigger_threshold: 0.01,
      btc_sell_percentage: 0.88,
    },
  },
};
