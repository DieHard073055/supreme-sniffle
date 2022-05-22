const { _, hasBeenDeposited } = require('./deposit_status_checker');

const main = () => {
  hasBeenDeposited().then(console.log);
};
