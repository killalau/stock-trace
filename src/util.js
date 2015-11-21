'use strict';

import url from 'url';
import request from 'request';
import BigNumber from 'bignumber.js';
import moment from 'moment';

export function get(opt){
    console.log(`HTTP GET: ${opt.url}${url.format({query: opt.qs})}`);

    return new Promise((resolve, reject) => {
        request.get(opt, (err, res, body) => {
            if(err){
                reject(new Error(err));
            }else if(res.statusCode !== 200){
                reject(new Error(`HTTP ${res.statusCode}`));
            }else{
                resolve(body);
            }
        });
    });
}

export function big(num){
    return new BigNumber(num);
}

export function escapeNa(str){
    return str === 'N/A' ? '' : str;
}

export function decodeString(str){
    return str.replace(/^"(.*)?"$/, '$1').replace(/""/g, '"');
}

export function decodeFloat(str){
    return big(parseFloat(str));
}

export function decodePercent(str){
    let rate = str.substr(0, str.length - 1);
    return decodeFloat(rate).div(100);
}

export function decodeDate(str){
    return moment(str, 'M/D/YYYY');
}

export function decodeDateTime(date, time){
    return moment(`${date} ${time}`, 'M/D/YYYY h:ma');
}

export function delay(time){
    return data => {
        return new Promise((reslove, reject) => {
            console.log(`Wait for ${time}ms`);
            setTimeout(() => reslove(data), time);
        });
    };
}
