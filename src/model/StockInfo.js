"use strict";

import mongoose from 'mongoose';

let StockInfoSchema = new mongoose.Schema({
    location: { type: String, index: true },
    code: { type: String, index: true },
    name: String,
    stdName: String,
});

StockInfoSchema.index({location:1, code:1}, {unique: true});
StockInfoSchema.set('autoIndex', false);

let StockInfo = mongoose.model('StockInfo', StockInfoSchema);

export default StockInfo;