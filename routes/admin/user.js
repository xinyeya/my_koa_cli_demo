const router = require('koa-router')()

router.get('/', async (ctx) => {
    await ctx.render('admin/user/home')
})

router.get('/add', async (ctx) => {
    ctx.body = '这是添加用户'
})

router.get('/update', async (ctx) => {
    ctx.body = '这是修改用户'
})

router.get('/del', async ctx => {
    ctx.body = '这是删除用户'
})

module.exports = router.routes()
