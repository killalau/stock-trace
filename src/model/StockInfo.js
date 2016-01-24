"use strict";

import mongoose from 'mongoose';

let StockInfoSchema = new mongoose.Schema({
    location: { type: String, index: true },
    code: { type: String, unique: true },
    name: String,
    stdName: String,
});

// StockInfoSchema.set('autoIndex', false);

let StockInfo = mongoose.model('StockInfo', StockInfoSchema);

export default StockInfo;