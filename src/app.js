'use strict';

import path from 'path';
import moment from 'moment';

import {trimObject} from './util/util.js';
import {readdir, readFile} from './util/fs.js';
import {qoute, toJs} from './api.js';
import * as db from './util/connection.js';

import StockInfo from './model/StockInfo.js';
import StockDailySummary from './model/StockDailySummary.js';
import StockPrice from './model/StockPrice.js';

let codes = new Array(2799);
codes = codes.fill(0).map((v,i) => {
    let code = '000'+(i+1);
    return code.substr(code.length - 4);
});

qoute({codes})
    .then(data => {
        let qouteTime = moment();
        let dataJson = data.map(toJs);

        console.log(`Qoute Finish at ${qouteTime.format()}, now save to db.`);
        db.open().then(con => {
            console.log('Success');
            Promise.all(dataJson.map(save))
                .then(db.close)
                .catch(err => {
                    console.error(err);
                    db.close();
                });
        });
    })
    .catch(console.error);


function save(json){
    let {yesterdaySummary, todaySummary} = extractDailySummary(json);
    let price = extractPrice(json);
    let promise = [
        StockDailySummary.createOrUpdate(yesterdaySummary),
        StockDailySummary.createOrUpdate(todaySummary),
        StockPrice.createOrUpdate(price),
    ];
    return Promise.all(promise);
}

function extractDailySummary(json) {
    let today = moment(json.lastTradeDatetime).utc().startOf('day');
    let yesterday = moment(today).subtract(1, 'd');

    let todaySummary = {
        location:    json.location         || null,
        code:        json.code             || null,
        date:        today.toDate()        || null,
        open:        json.open             || null,
        close:       json.lastTradePrice   || null,
        dayHigh:     json.dayHigh          || null,
        dayLow:      json.dayLow           || null,
        divYield:    json.dividendYield    || null,
        divPerShare: json.dividendPerShare || null,
        exDivDate:   json.exDividendDate   || null,
    };
    let yesterdaySummary = {
        location: json.location      || null,
        code:     json.code          || null,
        date:     yesterday.toDate() || null,
        close:    json.prevClose     || null,
    };

    return {
        todaySummary,
        yesterdaySummary,
    };
}

function extractPrice(json){
    return {
        location:      json.location          || null,
        code:          json.code              || null,
        datetime:      json.lastTradeDatetime || null,
        price:         json.lastTradePrice    || null,
        ch:            json.change            || null,
        chRate:        json.changeRate        || null,
        volume:        json.volume            || null,
        avgVolume:     json.avgVolume         || null,
        m50:           json.m50               || null,
        m50Ch:         json.m50Change         || null,
        m50ChRate:     json.m50ChangeRate     || null,
        m200:          json.m200              || null,
        m200Ch:        json.m200Change        || null,
        m200ChRate:    json.m200ChangeRate    || null,
        w52High:       json.w52High           || null,
        w52HighCh:     json.w52HighChange     || null,
        w52HighChRate: json.w52HighChangeRate || null,
        w52Low:        json.w52Low            || null,
        w52LowCh:      json.w52LowChange      || null,
        w52LowChRate:  json.w52LowChangeRate  || null,
    };
}
