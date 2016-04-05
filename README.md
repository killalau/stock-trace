# stock-trace

Stock-trace is a tool use Yahoo Finance API to quote the stock price, and save to MongoDB. I suggest setuping corn job to crawl data daily or more frequently for analysis purpose.

## Prerequisite

MongoDB

## Setup and use

Modify the configure files under `config` folder. You may modify the database connection configure base on environments.

You should pass NODE_ENV variable (either `production` or `development`) to nodejs to let it know which configure to load.

Tto run the tool, you should type `node ./src/index crawl` in the command line.
