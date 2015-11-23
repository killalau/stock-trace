'use strict';

import BigNumber from 'bignumber.js';
import moment from 'moment';

import {QOUTE_LIMIT, CRAWL_DELAY} from '../config/config.js';
import {
    get,
    big,
    escapeNa,
    decodeString,
    decodeFloat,
    decodePercent,
    decodeDate,
    decodeDateTime,
    delay
} from './util.js';

const QOUTE_URL = 'http://quote.yahoo.com/d/quotes.csv';
const INVALID_CODES = 'Invalid Codes';

function mapQouteResult(row){
    let [fullCode, name,
        lastTradePrice, lastTradeDate, lastTradeTime,
        change, changeRate,
        open, dayHigh, dayLow,
        m50, m50Change, m50ChangeRate,
        m200, m200Change, m200ChangeRate,
        w52High, w52HighChange, w52HighChangeRate,
        w52Low, w52LowChange, w52LowChangeRate,
        dividendYield, dividendPerShare, devidendPayDate, exDividendDate] = row;

    let [code, location] = fullCode.split('.');

    return {
        location,
        code,
        name,
        lastTradePrice:    decodeFloat(lastTradePrice),
        lastTradeDatetime: decodeDateTime(lastTradeDate, lastTradeTime),
        change:            decodeFloat(change),
        changeRate:        decodePercent(changeRate),
        open:              decodeFloat(open),
        dayHigh:           decodeFloat(dayHigh),
        dayLow:            decodeFloat(dayLow),
        m50:               decodeFloat(m50),
        m50Change:         decodeFloat(m50Change),
        m50ChangeRate:     decodePercent(m50ChangeRate),
        m200:              decodeFloat(m200),
        m200Change:        decodeFloat(m200Change),
        m200ChangeRate:    decodePercent(m200ChangeRate),
        w52High:           decodeFloat(w52High),
        w52HighChange:     decodeFloat(w52HighChange),
        w52HighChangeRate: decodePercent(w52HighChangeRate),
        w52Low:            decodeFloat(w52Low),
        w52LowChange:      decodeFloat(w52LowChange),
        w52LowChangeRate:  decodePercent(w52LowChangeRate),
        dividendYield:     decodeFloat(dividendYield),
        dividendPerShare:  decodeFloat(dividendPerShare),
        devidendPayDate:   decodeDate(devidendPayDate),
        exDividendDate:    decodeDate(exDividendDate)
    };
}

function _qoute(location, codes){
    return get({
        url: QOUTE_URL,
        qs: {
            s: codes.map(id => id + '.' + location).join(','),
            f: 'sn l1d1t1 c1p2 ohg m3m7m8 m4m5m6 kk4k5jj4j5 ydr1q'.replace(/\s/g, ''),
            e: '.csv'
        }
    })
    .then(csv => {
        let rows = csv.split('\n')
            .filter(row => row.trim().length > 0)
            .map(row => row.split(',').map(decodeString).map(escapeNa))
            .map(mapQouteResult)
            .filter(v => v.name !== '');
        console.log('DONE');
        return rows;
    });
}

function queueQoute(location, codes){
    return prev => {
        return _qoute(location, codes).then(cur => [].concat(prev, cur));
    };
}

export function qoute({location = 'HK', codes = []}){
    let codesParam = Array.isArray(codes) ? codes : [codes];
    if(codesParam.length < 1){
        return Promise.reject(new Error(INVALID_CODES));
    }else{
        let c = codesParam.splice(0, QOUTE_LIMIT);
        let promise = Promise.resolve([]);
        while(c.length > 0){
            if(promise){
                promise = promise
                    .then(queueQoute(location, c))
                    .then(delay(CRAWL_DELAY));
            }
            c = codesParam.splice(0, QOUTE_LIMIT);
        }
        return promise;
    }
}

export function toJs(data){
    let ret = Object.assign(data);

    Object.keys(ret).map(key => {
        let value = ret[key];
        if(value instanceof BigNumber){
            ret[key] = value.toNumber();
        }else if(moment.isMoment(value)){
            ret[key] = value.toDate();
        }
    });

    return ret;
}
