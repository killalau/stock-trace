
exports.formatJsonString = str => require('prettier').format(str, { parser: 'json' });
