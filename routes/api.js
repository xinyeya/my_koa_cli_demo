const router = require('koa-router')(),
    user = require('./api/user')

router.get('/', async (ctx) => {
    ctx.body = '这是前台首页'
})

router.use('/user', user)

module.exports = router.routes()