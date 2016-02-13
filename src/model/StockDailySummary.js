"use strict";

import mongoose from 'mongoose';

let StockDailySummarySchema = new mongoose.Schema({
    location: { type: String, index: true },
    code: { type: String, index: true },
    date: { type: Date, index: true },
    open: Number,
    close: Number,
    dayHigh: Number,
    dayLow: Number,
    divYield: Number,
    divPerShare: Number,
    exDivDate: Date,
});

StockDailySummarySchema.index({location:1, code:1, date:1}, {unique: true});
StockDailySummarySchema.set('autoIndex', false);

let StockDailySummary = mongoose.model('StockDailySummary', StockDailySummarySchema);

StockDailySummary.createOrUpdate = rec => {
    let {location, code, date} = rec;
    let saveWhenNotExist = updateRec => {
        return updateRec || StockDailySummary.create(rec);
    };
    return StockDailySummary.findOneAndUpdate({location, code, date}).then(saveWhenNotExist);
};

export default StockDailySummary;
