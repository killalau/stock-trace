'use strict';

import fs from 'fs';
import path from 'path';
import moment from 'moment';

import {trimObject} from './util/util.js';
import {qoute, toJs} from './api.js';

let codes = new Array(2799);
codes = codes.fill(0).map((v,i) => {
    let code = '000'+(i+1);
    return code.substr(code.length - 4);
});

qoute({codes})
    .then(data => {
        let qouteTime = moment();
        let filename = `qoute-${qouteTime.utc().format('YYYY.MM.DD-HH.mm.ss')}.json`;
        let filepath = path.resolve(__dirname, '../dataDump/', filename);
        let dataJson = data.map(toJs).map(trimObject);
        let json = JSON.stringify(dataJson);

        console.log(`Qoute Finish, save to file: ${filename}`);
        fs.writeFile(filepath, json);
    })
    .catch(console.error);
