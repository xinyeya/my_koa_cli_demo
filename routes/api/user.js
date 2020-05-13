const router = require('koa-router')()

router.get('/', async ctx => {
    let data = [{code: 200, msg: '查询成功', data: '1111'}]
    ctx.body = data
})

module.exports = router.routes()