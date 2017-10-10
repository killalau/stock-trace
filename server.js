const R = require('ramda');

const yahoo = require('./utils/yahoo');
const { HSI } = require('./utils/stockIndexes');

const job = async (symbol) => {
  console.log(`Start download ${symbol} stock data...`);
  const history = await yahoo.historical({
    symbol,
    from: '2017-10-01',
    to: '2017-10-07',
  });
  const quote = await yahoo.quote(symbol, [
    'recommendationTrend',
    'summaryDetail',
    'earnings',
    'calendarEvents',
    'upgradeDowngradeHistory',
    'price',
    'defaultKeyStatistics',
    'summaryProfile',
    'financialData',
  ]);

  const file = { history, quote };
  const path = require('path');
  const fs = require('fs');
  fs.writeFileSync(path.resolve(__dirname, 'dump', `${symbol}.json`), JSON.stringify(file));
  console.log(`Download ${symbol} stock data success`);
}

// HSI.forEach(async (symbol) => {
//   job(symbol);
// });

const data = HSI.reduce((result, symbol) => {
  const path = require('path');
  const fs = require('fs');
  const d = require(path.resolve(__dirname, 'dump', `${symbol}.json`));
  result.push(d);
  return result;
}, []);

let simpleData = data.map(d => {
  const symbol = R.path(['quote', 'price', 'symbol'], d);
  const name = R.path(['quote', 'price', 'longName'], d);
  const price = R.path(['quote', 'price', 'regularMarketPrice'], d);
  const dividend = R.path(['quote', 'summaryDetail', 'dividendYield'], d);
  return { symbol, name, price, dividend };
});

simpleData = R.sortWith([
  R.descend(R.prop('dividend')),
])(simpleData);

console.log(simpleData.slice(0, 10));
