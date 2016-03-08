"use strict";

import mongoose from 'mongoose';

let StockPriceSchema = new mongoose.Schema({
    location: { type: String, index: true },
    code: { type: String, index: true },
    datetime: { type: Date, index: true },
    price: Number,
    ch: Number,
    chRate: Number,
    volume: Number,
    avgVolume: Number,
    m50: Number,
    m50Ch: Number,
    m50ChRate: Number,
    m200: Number,
    m200Ch: Number,
    m200ChRate: Number,
    w52High: Number,
    w52HighCh: Number,
    w52HighChRate: Number,
    w52Low: Number,
    w52LowCh: Number,
    w52LowChRate: Number,
});

StockPriceSchema.index({location:1, code:1, datetime:1}, {unique: true});
StockPriceSchema.set('autoIndex', false);

let StockPrice = mongoose.model('StockPrice', StockPriceSchema);

StockPrice.createOrUpdate = rec => {
    let {location, code, datetime} = rec;
    let options = { new: true, upsert: true };
    return StockPrice.findOneAndUpdate({location, code, datetime}, rec, options);
};

export default StockPrice;
