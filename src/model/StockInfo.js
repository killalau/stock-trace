"use strict";

import mongoose from 'mongoose';

let StockInfoSchema = new mongoose.Schema({
    location: { type: String, index: true },
    code: { type: String, index: true },
    name: String,
    stdName: String,
});

StockInfoSchema.index({location:1, code:1}, {unique: true});
StockInfoSchema.set('autoIndex', true);

let StockInfo = mongoose.model('StockInfo', StockInfoSchema);

StockInfo.createOrUpdate = rec => {
    let {location, code} = rec;
    let options = { new: true, upsert: true };
    return StockInfo.findOneAndUpdate({location, code}, rec, options);
};

export default StockInfo;