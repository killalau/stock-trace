const R = require('ramda');
const axios = require('axios');
const cheerio = require('cheerio');

const getStockList = exports.getStockList = async () => {
  const res = await axios.get('https://www.hkex.com.hk/chi/market/sec_tradinfo/stockcode/eisdeqty_c.htm');
  if (res.status !== 200) throw Error(res);

  const $ = cheerio.load(res.data);
  const rows = $('.table_grey_border tr');
  const values = rows.toArray().map((el) => {
    const tds = $(el).find('td');
    const name = tds.eq(1).text();
    let code = tds.eq(0).text();
    code = /^0/.test(code) ? code.substr(1) + '.HK' : null;
    return { code, name };
  });
  return values.filter(R.prop('code'));
};
