const app = new (require('koa'))(),
    router = new (require('koa-router'))(),
    render = require('koa-art-template'),
    admin = require('./routes/admin'),
    api = require('./routes/api'),
    path = require('path'),
    index = require('./routes/index')

// 嵌套子路由
router.use('/', index)
router.use('/api', api)
router.use('/admin', admin)


// 启动路由
app.use(router.routes()).use(router.allowedMethods());

// 配置koa-art-template中间件
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});

app.listen(5000)