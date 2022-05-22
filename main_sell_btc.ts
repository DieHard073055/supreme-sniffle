import {
  // placeOrder,
  // getBalance,
  getBtcPrice,
} from './ftx';

const main = async (
  usd_amount_to_sell: string | number,
  highest_percentage: number,
  number_of_orders: number,
) => {
  const usdAmountToSell = Number(usd_amount_to_sell) || 1000;
  const highestPercentage = highest_percentage || 1.01;
  const numberOfOrders = number_of_orders || 5;

  console.log(`USD amount to sell ${usdAmountToSell}`);
  console.log(`percentage ${highestPercentage}`);
  console.log(`number of orders ${numberOfOrders}`);
  console.log('\n');

  const priceResult = await getBtcPrice();
  const { price } = priceResult;
  const totalBtcToSell = usdAmountToSell / price;
  const high = price * highestPercentage;
  const diff = (high - price) / numberOfOrders;

  console.log(`current BTC price: ${price}`);
  console.log(`total BTC to sell ${totalBtcToSell}`);
  console.log(`from ${price} to ${high}`);

  let total = 0;
  for (let i = 0; i < numberOfOrders; i += 1) {
    const currentPrice = price + (i * diff);
    console.log(`placeOrder("BTC/USD", "sell", ${currentPrice}, ${totalBtcToSell / numberOfOrders});`);
    total += (totalBtcToSell / numberOfOrders) * currentPrice;
  }
};

const args = process.argv.slice(2);

if (args.length > 2) {
  main(...args);
} else {
  console.log('usd amount to sell, highest percentage, number of orders');
  console.log('1000, 1.05, 5');
}
