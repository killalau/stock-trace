require("babel-core/register");

var crawler = require('./crawler/app.js');
var server = require('./server/app.js');

var argv = process.argv.slice();
var nodepath = argv.shift();
var indexfile = argv.shift();

switch (argv[0]) {
    case 'crawl':
        var location = argv[1] || 'HK';
        crawler.crawl(location);       
        break;

    case 'server':
        var port = argv[1] || 3000;
        server.start(port);
        break;
    default:
        break;
}
