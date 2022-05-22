const { _, has_been_deposited } = require('./deposit_status_checker');

const main = () => {
  has_been_deposited().then(console.log);
}
