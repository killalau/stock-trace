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
                    console.log(err);
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
        location:    json.location,
        code:        json.code,
        date:        today.toDate(),
        open:        json.open,
        close:       json.lastTradePrice,
        dayHigh:     json.dayHigh,
        dayLow:      json.dayLow,
        divYield:    json.dividendYield,
        divPerShare: json.dividendPerShare,
        exDivDate:   json.exDividendDate,
    };
    let yesterdaySummary = {
        location: json.location,
        code:     json.code,
        date:     yesterday.toDate(),
        close:    json.prevClose,
    };

    return {
        todaySummary,
        yesterdaySummary,
    };
}

function extractPrice(json){
    return {
        location:      json.location,
        code:          json.code,
        datetime:      json.lastTradeDatetime,
        price:         json.lastTradePrice,
        ch:            json.change,
        chRate:        json.changeRate,
        volume:        json.volume,
        avgVolume:     json.avgVolume,
        m50:           json.m50,
        m50Ch:         json.m50Change,
        m50ChRate:     json.m50ChangeRate,
        m200:          json.m200,
        m200Ch:        json.m200Change,
        m200ChRate:    json.m200ChangeRate,
        w52High:       json.w52High,
        w52HighCh:     json.w52HighChange,
        w52HighChRate: json.w52HighChangeRate,
        w52Low:        json.w52Low,
        w52LowCh:      json.w52LowChange,
        w52LowChRate:  json.w52LowChangeRate,
    };
}
