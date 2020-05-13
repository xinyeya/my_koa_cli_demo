const router = require('koa-router')()

router.get('/', async ctx => {
    ctx.body = '这是查询轮播图'
})

router.get('/add', async ctx => {
    ctx.body = '这是添加轮播图'
})

router.get('/update', async ctx => {
    ctx.body = '这是修改轮播图'
})

router.get('/del', async ctx => {
    ctx.body = '这是删除轮播图'
})

module.exports = router.routes()
