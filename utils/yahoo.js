const yahoo = require('yahoo-finance');
const { promisifyAll } = require('bluebird');

module.exports = promisifyAll(yahoo);
