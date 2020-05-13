const router = require('koa-router')()

router.get('', async (ctx) => {
    ctx.body = '<h2>首页</h2>'
})

router.get('case', async (ctx) => {
    ctx.body = '案例'
})

router.get('about', async (ctx) => {
    ctx.body = '关于'
})

module.exports = router.routes()