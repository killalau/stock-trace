const R = require('ramda');

const yahoo = require('./utils/yahoo');
const { HSI } = require('./utils/stockIndexes');
const { getStockList } = require('./services/hkStock');

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

  let file = { history, quote };
  file = JSON.stringify(file);
  file = require('prettier').format(file, { parser: 'json' });
  const path = require('path');
  const fs = require('fs');
  fs.writeFileSync(path.resolve(__dirname, 'dump', `${symbol}.json`), file);
  console.log(`Download ${symbol} stock data success`);
}

const promises = HSI.map(stock => job(stock.symbol));
Promise.all(promises)
  .then(() => {
    const path = require('path');
    const fs = require('fs');
    let data = HSI.reduce((result, stock) => {
      const { symbol, name } = stock;
      const d = require(path.resolve(__dirname, 'dump', `${symbol}.json`));
      const price = R.path(['quote', 'price', 'regularMarketPrice'], d);
      const dividend = R.path(['quote', 'summaryDetail', 'dividendYield'], d);
      result.push({ symbol, name, price, dividend });
      return result;
    }, []);

    data = R.sortWith([
      R.descend(R.prop('dividend')),
    ])(data);

    const json = JSON.stringify(data);
    const file = require('./utils/format').formatJsonString(json);
    fs.writeFileSync(path.resolve(__dirname, 'dump/HSI.json'), file);
  })
  .then(() => getStockList())
  .then(stocks => {
    const json = JSON.stringify(stocks);
    const file = require('./utils/format').formatJsonString(json);
    const path = require('path');
    require('fs').writeFileSync(path.resolve(__dirname, './dump/stocks.json'), file);
  });
