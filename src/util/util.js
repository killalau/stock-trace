'use strict';

import path from 'path';
import fs from 'fs';
import url from 'url';
import request from 'request';
import BigNumber from 'bignumber.js';
import moment from 'moment';

import * as devConfig from '../../config/devConfig.js';
import * as prodConfig from '../../config/prodConfig.js';

export var config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

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
    let num = big(parseFloat(str));
    return num.isNaN() ? null : num;
}

export function decodeBigFloat(str){
    let match = str.match(/^(\d+(\.\d+)?)(\w)$/);
    if(match){
        const UNIT = ['M', 'B', 'T'];
        let [matchStr, num, dp, unit] = match;
        let unitIdx = UNIT.indexOf(unit);
        num = big(num);
        if(unitIdx > 0){
            num = num.mul(big(1000).pow(unitIdx));
        }
        return num.isNaN() ? null : num;
    }else{
        return null;
    }
}

export function decodePercent(str){
    let rate = str.substr(0, str.length - 1);
    let num = decodeFloat(rate);
    return num ? num.div(100) : null;
}

export function decodeDate(str){
    let ret = moment(str, 'M/D/YYYY');
    return ret.isValid() ? ret : null;
}

export function decodeDateTime(date, time){
    let ret = moment(`${date} ${time}`, 'M/D/YYYY h:ma');
    return ret.isValid() ? ret : null;
}

export function trimObject(obj){
    let ret = Object.assign({}, obj);
    Object.keys(ret).forEach(key => {
        let value = ret[key];
        if(value == null){
            delete ret[key];
        }
    });
    return ret;
}

export function delay(time){
    return data => {
        return new Promise((reslove, reject) => {
            console.log(`Wait for ${time}ms`);
            setTimeout(() => reslove(data), time);
        });
    };
}
