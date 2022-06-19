const { place_order, get_balance, get_btc_price } = require('./ftx');
const DRY_RUN = true;

const main = async (usd_amount_to_sell, highest_percentage, number_of_orders) => {
  const _usd_amount_to_sell = usd_amount_to_sell || 1000;
  const _highest_percentage = highest_percentage || 1.01;
  const _number_of_orders = number_of_orders || 5;

  console.log(`USD amount to sell ${_usd_amount_to_sell}`);
  console.log(`percentage ${_highest_percentage}`);
  console.log(`number of orders ${_number_of_orders}`);
  console.log("\n")

  const price_result = await get_btc_price();
  const price = price_result["price"];
  const total_btc_to_sell = _usd_amount_to_sell / price;
  const high = price * _highest_percentage;

  const get_diff = (price, high, _number_of_orders) => {
    if(_number_of_orders == 1){
      return high
    }
    return (high - price) / (_number_of_orders - 1);
  }
  const diff = get_diff(price, high, _number_of_orders);

  console.log(`current BTC price: ${price}`);
  console.log(`total BTC to sell ${total_btc_to_sell}`);
  console.log(`from ${price} to ${high}`);

  let total = 0
  if( _number_of_orders > 1 ){
    for (let i = 0; i < _number_of_orders; i++) {
      const current_price = price + (i * diff)
      console.log(`place_order("BTC/USD", "sell", ${current_price}, ${total_btc_to_sell / _number_of_orders});`);
      if(!DRY_RUN)
      await place_order("BTC/USD", "sell", current_price, total_btc_to_sell / _number_of_orders);
      total += (total_btc_to_sell / _number_of_orders) * current_price
    }
  }else{
    console.log(`place_order("BTC/USD", "sell", ${high}, ${total_btc_to_sell});`);
    if(!DRY_RUN)
    await place_order("BTC/USD", "sell", high, total_btc_to_sell);
    total = total_btc_to_sell * high;
  }
  console.log("total: " + total);
}

let args = process.argv.slice(2);

if (args.length > 2) {
  main(...args)
} else {
  console.log("usd amount to sell, highest percentage, number of orders");
  console.log("1000, 1.05, 5");
}
