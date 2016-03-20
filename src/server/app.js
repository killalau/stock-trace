import Koa from 'koa';
import router from 'koa-router';

export function start(port = 3000){
    const app = new Koa();
    
    app.use(async (ctx, next) => {
        let start = new Date();
        await next();
        let ms = new Date() - start;
        console.log('%s %s - %sms', ctx.method, ctx.url, ms);
    });
    
    app.use(async ctx => {
        ctx.body = 'Hello World';
    });
    
    app.listen(port);
} 
