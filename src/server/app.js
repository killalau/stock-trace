import Koa from 'koa';

import * as db from '../util/connection.js';
import api from './router/api.js';

export function start(port = 3000){
    const app = new Koa();
    
    app.use(async (ctx, next) => {
        let start = new Date();
        await next();
        let ms = new Date() - start;
        console.log('%s %s - %sms', ctx.method, ctx.url, ms);
    });
    
    app.use(api.routes())
        .use(api.allowedMethods());
    
    db.open().then(() => {
        app.listen(port);
        console.log(`Web server started on port: ${port}`)        
    });
} 
