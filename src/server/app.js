import Koa from 'koa';

export function start(port = 3000){
    const app = new Koa();
    
    app.use(function *(next){
        let start = new Date();
        yield next;
        let ms = new Date() - start;
        console.log('%s %s - %sms', this.method, this.url, ms);
    });
    
    app.use(function *(){
        this.body = 'Hello World';
    })
    
    app.listen(port);
} 
