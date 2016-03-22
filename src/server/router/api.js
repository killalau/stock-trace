import Router from 'koa-router';
import moment from 'moment';

import StockDailySummary from '../../model/StockDailySummary.js';

const router = Router({
    prefix: '/api',
});

router.get('/daily-summary', async (ctx, next) => {
    let {location, code, date} = ctx.query;
    let dateAry = Array.isArray(date) ? date : date ? [date] || [] : []; 
    let [from, to] = dateAry;
    to = to || from;
    let range = [from, to].map(d => moment(d))
                    .sort((a,b) => a.isBefore(b) ? -1 : 1);
    let validDate = range[0].isValid() && range[1].isValid();
    from = range[0].startOf('day').utc();
    to = range[1].endOf('day').utc();
    range = [from, to].map(d => d.toDate());
    
    if(validDate){
        let summary = await StockDailySummary.find({
            location,
            code,
            date: { $gte: from, $lte: to }
        });
    }
    
    ctx.body = {location, code, validDate, range, summary};
});

export default router;
