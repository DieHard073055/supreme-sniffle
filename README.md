## BTC seller script

#### Setup
Before you can run this script you would need to create a .env file in the root directory with the contents like so.
```.env
API_SECRET="YOUR FTX API SECRET"
API_KEY="YOUR FTX API KEY"
```

#### How to run the script

`main_sell_btc.js` - is the place you want to be looking for to sell you btc.

> Make sure to set DRY_RUN to false if you want the script to actually place the order.


Run the script with `node main_sell_btc.js 1000 1 1`.
 - 1000 - the amount in USD you would like to sell (in this case $1000)
 - 1 - how high the percentage should be for ladder sells
 - 1 - the number of orders

If you just want to sell $1000 worth of BTC just run the command `node main_sell_btc.js 1000 1 1`.
```
USD amount to sell 1000
percentage 1
number of orders 1


current BTC price: 18563
total BTC to sell 0.05387060281204547
from 18563 to 18563
place_order("BTC/USD", "sell", 18563, 0.05387060281204547);
total: 1000
```

If you want to sell $1000 worth of BTC but want to ladder out your sell orders (10 orders) upto last order being 10% above the current price (you would get $45 extra). `node main_sell_btc.js 1000 1.1 10`
```
USD amount to sell 1000
percentage 1.1
number of orders 10


current BTC price: 18436
total BTC to sell 0.05424170101974398
from 18436 to 20279.600000000002
place_order("BTC/USD", "sell", 18436, 0.005424170101974398);
place_order("BTC/USD", "sell", 18620.36, 0.005424170101974398);
place_order("BTC/USD", "sell", 18804.72, 0.005424170101974398);
place_order("BTC/USD", "sell", 18989.08, 0.005424170101974398);
place_order("BTC/USD", "sell", 19173.440000000002, 0.005424170101974398);
place_order("BTC/USD", "sell", 19357.800000000003, 0.005424170101974398);
place_order("BTC/USD", "sell", 19542.16, 0.005424170101974398);
place_order("BTC/USD", "sell", 19726.52, 0.005424170101974398);
place_order("BTC/USD", "sell", 19910.88, 0.005424170101974398);
place_order("BTC/USD", "sell", 20095.24, 0.005424170101974398);
total: 1045.0000000000002
```

Or you just want to sell $1000 with at 50% higher. `node main_sell_btc.js 1000 1.5 1 `
```
USD amount to sell 1000
percentage 1.5
number of orders 1


current BTC price: 18253
total BTC to sell 0.0547855147099107
from 18253 to 27379.5
place_order("BTC/USD", "sell", 27379.5, 0.0547855147099107);
total: 1500
```