const router = require('koa-router')(),
    user = require('./admin/user'),
    focus = require('./admin/focus')

router.get('/', ctx => {
    ctx.render('index', {})
})

router.use('/user', user)
router.use('/focus', focus)

module.exports = router.routes()