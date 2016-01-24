'use strict';

import mongoose from 'mongoose';

import {config} from './util';

const {DB_HOST, DB_PORT, DB_NAME, DB_OPTIONS} = config;
const CONNECTION_STRING = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export function open(){
    return new Promise((resolve, reject) => {
        console.log(`Connect to MongoDB ${CONNECTION_STRING}`);
        mongoose.connect(CONNECTION_STRING, DB_OPTIONS, resolve);
    });
}

export function close(){
    return new Promise((resolve, reject) => {
        mongoose.disconnect(resolve);
    });
}
