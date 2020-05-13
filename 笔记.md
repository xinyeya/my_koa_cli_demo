## 1. koa异步处理async，await
`async`是“异步”的简写，而`await`可以认为是`async wait`的简写。所以应该很好理解`async`用于申明一个`function`是异步的，而`await`用于等待一个异步方法执行方法。

**简单理解：**
`async`是让方法变成异步。

`await`是等待异步方法执行完成。

**详细说明：**

`async`是让方法变成异步，在终端里用`node`执行这段代码，你会发现输出了`Promise{'hello async'}`，这时候会发现它返回的是Promise。
```js
async function testAsync(){
    return 'Hello async'
}
const result = testAsync()
console.log(result)
```

`await`在等待`async`方法执行完毕，其实`await`等待的只是一个表达式，这个表达式在官方文档里说的是`Promise`对象，但是它也可以接受普通值。注意: `await`必须在`async`方法中才可以使用`await`访问本身就会造成程序停止堵塞，所以必须在异步方法中才可以使用。

```js
function getData(){
    return '张三'
}
async function testAsync() {
    return "Hello async"
}
```

## 2. koa路由
路由(Routing)是由一个`URL`(或者叫路径)和一个特定的`HTTP`方法（get，post等）组成的，涉及到应用如何响应客户端对某个网站节点的访问。

通俗的讲：路由就是根据不同的`URL`地址，加载不同的页面实现不同的功能。

`koa`中的路由和`Express`有所不同，在`Express`中直接引入`Express`就可以配置路由，但是在`koa`中我们需要安装对应的`koa-router`路由模块来实现。
```bash
npm install --save koa-router
```
```js
const app = new (require('koa'))
const router = new (require('koa-router'))

// ctx 上下文 context,包含了request和response等信息

// 配置路由
router.get('/', async ctx => {
    ctx.body = '首页' // 返回数据 相当于：原生里面的res.writeHead()  res.end()
})
router.get('/news', async ctx => {
    // 从ctx中读取
    ctx.body = '这是一个新闻页面'
})

/*启动路由*/
app.use(router.routes())
    /*
        router.allowedMethods()作用：这是官方文档的推荐用法，我们可以
        看到router.allowedMethods()用在了路由匹配 router.routes() 之后，所以在当所有
        路由中间件最后调用，此时根据 ctx.status 设置 response 响应头
     */
    .use(router.allowedMethods());

app.listen(5000);
```

## 3. koa路由get传值

在`koa2`中`GET`传值通过`request`接收，但是接收的方法有两种：`query`和`querystring`。

- `query`：返回的是格式化好的参数对象。
- `querystring`：返回的是请求字符串。

```js
const app = new (require('koa'))
const router = new (require('koa-router'))

// ctx 上下文 context,包含了request和response等信息

// 配置路由
router.get('/', async ctx => {
    ctx.body = '首页' // 返回数据 相当于：原生里面的res.writeHead()  res.end()
})
router.get('/news', async ctx => {
    // 从ctx中读取get传的值
    console.log(ctx.query) // 获取的是对象    用的最多的方式

    console.log(ctx.querystring) // 获取的是一个字符串

    // ctx 里面的request里面获取get传值
    console.log(ctx.request.url) // 获取传的值
    console.log(ctx.request.host) // 获取域名
    console.log(ctx.request.query)
    ctx.body = '这是一个新闻页面'
})

/*启动路由*/
app.use(router.routes())
    /*
        router.allowedMethods()作用：这是官方文档的推荐用法，我们可以
        看到router.allowedMethods()用在了路由匹配 router.routes() 之后，所以在当所有
        路由中间件最后调用，此时根据 ctx.status 设置 response 响应头
     */
    .use(router.allowedMethods());

app.listen(5000);
```

**动态路由**
```js
const app = new (require('koa'))
const router = new (require('koa-router'))

// ctx 上下文 context,包含了request和response等信息

// 配置路由
router.get('/', async ctx => {
    ctx.body = '首页' // 返回数据 相当于：原生里面的res.writeHead()  res.end()
})

// 新闻路由
router.get('/news', async ctx => {
    // 从ctx中读取get传的值
    console.log(ctx.query) // 获取的是对象    用的最多的方式

    console.log(ctx.querystring) // 获取的是一个字符串

    // ctx 里面的request里面获取get传值
    console.log(ctx.request.url) // 获取传的值
    console.log(ctx.request.host) // 获取域名
    console.log(ctx.request.query)
    ctx.body = '这是一个新闻页面'
})

// 动态路由(可以传入多个值)
router.get("/newscontent/:aid/:cid", async ctx => {
    // 获取动态路由的传值
    console.log(ctx.params)
    ctx.body = '动态路由'
})

/*启动路由*/
app.use(router.routes())
    /*
        router.allowedMethods()作用：这是官方文档的推荐用法，我们可以
        看到router.allowedMethods()用在了路由匹配 router.routes() 之后，所以在当所有
        路由中间件最后调用，此时根据 ctx.status 设置 response 响应头
     */
    .use(router.allowedMethods());

app.listen(5000);
```

## 3. 中间件

### 1. 中间件是什么
通俗的讲：中间件就是匹配路由之前或者匹配路由完成做的一系列的操作，我们就可以把它叫做中间件。

在`express`中间件是一个函数，它可以访问一个请求对象，响应对象，和`web`应用中请求处理-响应循环流程中的中间件，一般被命名为`next`的变量。将`koa`中中间件和`express`优点类似

中间件的功能包括：
	执行任何代码。
	修改请求和响应对象。
	终结请求-响应循环。
	调用堆栈中的下一个中间件。
	
如果我的`get，post`回调函数中，如果没有`next`参数，那么就匹配上一个路由，就不会往下匹配了。如果想往下匹配的话，那么就需要写`next()`

### 2. koa应用可使用如下几种中间件
	应用中间件
	路由中间件
	错误处理中间件
	第三方中间件

### 1. 应用级中间件
```js
const koa = require('koa')
const Router = require('koa-router')

const app = new koa()
const router = new Router()

app.use(async (ctx, next)=>{
	console.log(new Date())
	await next()
})

router.get('/', (ctx, next) => {
	ctx.body = 'Hello koa'
})

router.get('/news', (ctx, next) => {
	ctx.body = '新闻页面'
})

app.use(router.routes()) // 作用：启动路由
app.use(router.allowedMethods()) // 作用：当请求出错时的处理逻辑

app.listen(3000, ()=>{
	console.log('starting at port 3000')
})
```

### 2. 路由中间件
```js
const app = new (require('koa'))
const router = new (require('koa-router'))


// 配置路由
router.get('/', async ctx => {
    ctx.body = '首页' // 返回数据 相当于：原生里面的res.writeHead()  res.end()
})

app.use(async (ctx, next)=>{
    console.log(new Date())
    await next()
})

// 匹配到news以后继续向下匹配路由
router.get('/news', async (ctx, next) => {
    console.log('这是新闻页面')
    // ctx.body = '这是一个新闻页面'
    await next()
})

router.get('/news', async (ctx)=>{
    ctx.body = '这是一个新闻页面'
})

/*启动路由*/
app.use(router.routes())
    /*
        router.allowedMethods()作用：这是官方文档的推荐用法，我们可以
        看到router.allowedMethods()用在了路由匹配 router.routes() 之后，所以在当所有
        路由中间件最后调用，此时根据 ctx.status 设置 response 响应头
     */
    .use(router.allowedMethods());

app.listen(5000);
```

### 3. 错误处理中间件
```js
const koa = require('koa')
const Router = require('koa-router')

const app = new koa()
const router = new Router()

app.use(async (ctx, next)=>{
	console.log(new Date())
	await next()
	if(ctx.status == 404){
		ctx.status = 404
		ctx.body = '这是一个404页面'
	}else{
		console.log(ctx.url)
	}
})

router.get('/', (ctx, next) => {
	ctx.body = 'Hello koa'
})

router.get('/news', (ctx, next) => {
	ctx.body = '新闻页面'
})

app.use(router.routes()) // 作用：启动路由
app.use(router.allowedMethods()) // 作用：当请求出错时的处理逻辑

app.listen(3000, ()=>{
	console.log('starting at port 3000')
})
```

### 4. 第三方中间件
```js
const static = require('koa-static')
const staticPath = './static'

app.use(static(
	path.join(__dirname, static)
))

const bodyParser = require('koa-bodyParser')
app.use(bodyParser())
```

## 4. ejs模板引擎
### 1. ejs模板引擎的使用
```bash
npm i koa-views --save
npm i ejs --save`
```

### 2. 引入koa-views配置中间件
```js
const views = require('koa-views')
app.use(__dirname, {extension: 'ejs'})
await ctx.render('index')
```

### 3. 引入模板案例
```js
const app = new (require('koa'))
const router = new (require('koa-router'))
const views = require('koa-views')

app.use(views('views', {extension: 'ejs'}))

// 首页
router.get('/', async ctx => {
    let title = 'hello world'
    let list = [11,1,2,3,4,5,5]
    await ctx.render('index', {
        title,
        list
    })
})

// 新闻页
router.get('/', async ctx => {
    ctx.render('news')
})

// 开启路由
app.use(router.routes()).use(router.allowedMethods())

app.listen(5000)
```
### 4. ejs引入模板
```ejs
<%- include('header.ejs')%>
```

### 5. ejs绑定数据
```ejs
<%=h%>
```

### 6. ejs绑定html数据
```ejs
<%-h%>
```

### 7. ejs判断语句
```ejs
<%if (true) {%>
	<div>true</div>
<%}%>
```

### 8. 公共数据
注意：我们需要在每一个路由的`render`里面都要渲染一个公共的数据
公共的数据放在这个里面，这样的话在模板的任何地方都可以使用
```js
ctx.state = {
	// 放在中间件里面
	session: this.session,
	title: 'app'
}

// 配置中间件
app.use(async (ctx, next) => {
    ctx.state.userinfo = '张三'
    await next()
})
```

## 5. koa中-bodyparser中间件的使用
### 1. 安装`koa-bodyparser`
```bash
npm i koa-bodyparser --save
```

### 2. 引入配置中间件
```js
var app = new (require('koa'))
var bodyParser = require('koa-bodyParser')

app.use(bodyParser())

app.use(async ctx=>{
	ctx.body = ctx.request.body
})
```

## 6. koa2-static静态资源
### 1. 安装
```bash
npm i koa-static --save
```
案例
```js
const   app = new (require('koa')),
        router = new (require('koa-router')),
        views = require('koa-views'),
        bodyparser = require('koa-bodyparser'),
        static = require('koa-static')

// koa-static 静态web服务   首先去static目录找，如果能找到返回对应的文件，找不到继续向下匹配
// 静态资源中间件可以配置多个
app.use(static(__dirname + '/static'))
app.use(static(__dirname + '/public'))

// 配置bodyparser中间件
app.use(bodyparser())

// 配置模板引擎
app.use(views('views', {extension: 'ejs'}))

// 配置中间件
app.use(async (ctx, next) => {
    ctx.state.userinfo = '张三'
    await next()
})

router.get('/', async (ctx) => {
    await ctx.render('index')
})


// 开启路由
app.use(router.routes()).use(router.allowedMethods())

app.listen(5000)
```

## 7. art-template
### 1. 安装
```shell
npm install art-template --save
npm install koa-art-template --save
```

### 2. 引入
```js
const render = require('koa-art-template')
```

### 3. 配置模板引擎
```js
const path = require('path')
render(app, {
	root: path.join(__dirname, 'view'), // 视图的位置
	extname: '.art', // 后缀名
	debug: process.env.NODE_ENV != 'production' // 是否开启调试
})
```
中文文档：https://aui.github.io/art-template/zh-cn/docs/index.html

## 8 cookie的使用

### 1. cookie简介
- `cookie` 是存储访问者计算机中的变量。可以让我们在同一个浏览器访问同一个域名的时候共享数据。
- `http` 是无状态协议。简单的说，当你浏览了一个页面，然后转到同一个网站的另一个页面，服务器无法认识到这是同一个浏览器在访问到同一个网站。每一次访问，都是没有任何关系的。

> 1. cookie保存在浏览器客户端
> 2. 可以让我们用同一个浏览器访问同一个域 名的时候共享数据

> 1. 保存用户信息
> 2. 浏览器历史记录
> 3. 猜你喜欢的功能
> 4. 10天免登陆
> 5. 多个页面之间的数据传递
> 6. cookie 实现购物车功能

### 2. `koa cookie`的使用

1. `koa`中设置`Cookie`的值
```js
ctx.cookie.set(name, values, [options])
```

通过`options`设置`cookie name`的`value`:

| options名称 | options值                                                    |
| ----------- | ------------------------------------------------------------ |
| `maxAge`    | 一个数字表示从`Date.now()`得到的毫秒数                       |
| `expires`   | `cookie`过期的`Date`                                         |
| `path`      | `cookie`路径，默认是`/`                                      |
| `domain`    | `cookie`域名                                                 |
| `secure`    | 安全`cookie`默认是`false`，设置成`true`表示只有`https`可以访问 |
| `httpOnly`  | 是否只有服务器可以访问`cookie`，默认是`true`                 |
| `overwrite` | 一个布尔值，表示是否覆盖以前设置的同名的`cookie`（默认是`false`）。如果是`true`，在同一个请求中设置相同名称的所有`cookie`（不管路径或域）是否在设置此`Cookie`时从`Set-Cookie`标头中过滤掉。 |

**代码案例**
```js
const   app = new (require('koa')),
        router = new (require('koa-router')),
        render = require('koa-art-template'),
        path = require('path')

// 配置模板引擎
render(app, {
    root: path.join(__dirname, 'views'), // 视图的位置
    extname: '.html', // 后缀名
    debug: process.env.NODE_ENV != 'production' // 是否开启调试
})

router.get('/', async (ctx) => {

    ctx.cookies.set('userinfo', 'hello world', {
        maxAge: 60*1000*60, // 过期时间
        // expires: '2020-5-13', // 具体的时间
        // path: '/news', // 配置可以正常访问的页面
        // domain: '*.baidu.com', //正常情况下不要设置，默认就是当前域下面的所有页面都可以访问。
        httpOnly: false // true表示这个cooki只有服务端可以访问，false表示客户端(js)，服务端都可以访问。
    })

    let title = 'Hello world'
    await ctx.render('index', {
        title
    })
})

router.get('/news', async ctx => {
    let userinfo = ctx.cookies.get('userinfo')
    console.log(userinfo)
})


// 开启路由
app.use(router.routes()).use(router.allowedMethods())

app.listen(5000)
```

### 3. `koa`中设置中文`cookie`
```js
console.log(Buffer.from('hello,world').toString('base64')); // 转换成base64字符串; aGVsbG93LHdvcmxk
console.log(Buffer.from('aGVsbG93LHdvcmxk', 'base64').toString()); //还原base64字符串；hello, world
```

## 9. session的使用
### 1. session简单介绍
`session`是另一种记录客户状态的机制，不同的是`Cookie`保存在客户端浏览器中，而`session`保存在服务器上。

### 2. session的工作流程
当浏览器访问服务器并发送第一次请求时，服务器会创建一个`session`对象，生成一个类似于`key, value`的键值对，然后`key(cookie)`返回到浏览器(客户)端，浏览器下次再访问时，携带key(cookie)，找到对应的`session(value)`。客户的信息都保存在`session`中

### 3. koa-session 的使用
1. 安装	express-session
```shell
npm install koa-session --save
```

2. 引入express-session
```shell
const session = require('koa-session')
```

3. 设置官方文档提供的中间件
```shell
app.keys = ['some seccet hurr']
const CONFIG = {
	key: 'koa:sess', // session key (default is koa:sess)
	maxAge: 86400000, // session 的过期时间 maxAge in ms(default is 1 days)
	overwrite: true, // 是否可以overwrite (默认 default true)
	httpOnly: true, // session 是否只有服务器端可以访问
	signet: true, // 签名默认true
	rolling: false, // 每次请求时强行设置session，这将重置session过期时间(默认:false)
	renew: false // (boolean) renew session when session nearly exired
}

app.use(session(CONFIG, app))
```

### 4. 使用
```js
// 设置值
ctx.session.username = '张三'
// 获取值
ctx.session.username
```

### 4. Cookie 和 Session 的区别
1. `cookie`数据存放在客户的浏览器上，`session`数据放在服务器上
2. `cookie`不是很安全，别人可以分析存放在本地的`Cookie`并进行`cookie`欺骗，考虑到安全应当使用`session`
3. `session`会在一定时间内保存到服务器上。当访问增多时，会比较占用你服务器的性能考虑到减轻服务器性能方便，应当使用`cookie`。

## 10. `koa`封装`mongodb`数据的DB类库
手册链接：http://mongodb.github.io/node-mongodb-native
### 1. 安装mongodb数据库
```shell
npm i mongodb --save
```

### 2. 引入mongodb下面的MongoClient
```js
var MongoClient = require('mongodb').MongoClient
```

### 3. 定义数据库连接的地址	以及配置数据库
	`koa`数据库的名称
```js
var url = 'mongodb://admin:123456@localhost:27017'
var dbName = 'koa'
```

### 4. node.js连接数据库
```js
MongoClient.connect(url, (err, client)=>{
	const db = client.db(dbName) // 数据库db对象
})
```

### 5. 操作数据库
```js
// db.user.insert
MongoClient.connect(url, (err, db) => {
	db.collection('user').insertOne({'name': '张三'}, (err, res)=>{
		db.close() // 关闭连接
	})
})
```

案例代码

```js
const { MongoClient } = require('mongodb')
const url = 'mongodb://admin:123456@localhost:27017';
const dbName = 'koa';

MongoClient.connect(url, {useNewUrlParser: true ,useUnifiedTopology: true}, (err, client)=>{
    if (err) throw err
    let db = client.db(dbName)
    // 增加数据
    db.collection('user').insertOne({
        'username': '李四',
        'age': 23,
        'sex': '男',
        'status': 1
    }, (err, res)=>{
        if (!err) {
            console.log('增加数据成功')
            client.close()
        }
    })
})
```

## 11. 封装DB库
数据库配置文件：`modules/Config.js`
```js
// 配置文件
var app = {
    dbUrl: 'mongodb://admin:123456@localhost:27017/',
    dbName: 'koa'
}
module.exports = app
```

数据库操作类：`modules/db.js`
```js
var { MongoClient } = require('mongodb')
var Config = require('./config')

class Db {

    // 单例
    // 解决多次实例化无共享的问题
    static  getInstance () {
        if (!Db.instance){
            Db.instance = new Db()
        }
        return Db.instance
    }

    constructor() {
        this.dbClient = '' // 属性，放db对象
        this.connect() // 实例化的时候就连接数据库
    }

    // 连接
    connect(){
        return new Promise((resolve, reject) => {
            if (!this.dbClient){ // 解决数据库多次连接的问题
                MongoClient.connect(Config.dbUrl, { useNewUrlParser: true,useUnifiedTopology: true },(err, client)=>{
                    if (err) {
                        reject(err)
                    }else{
                        let db = client.db(Config.dbName)
                        resolve(db)
                    }
                })
            }
        })
    }

    // 查询
    find (collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db=>{
                    let res = db.collection(collectionName).find(json)
                    res.toArray((err, docs)=>{
                        if (err){
                            reject(err)
                        }
                        resolve(docs)
                    })
                }
            )
        })
    }

    // 更新
    update (collectionName, jsonOld, jsonNew) {
        return new Promise((resolve, reject) => {
            this.connect().then((db)=>{
                db.collection(collectionName).updateOne(jsonOld, {
                    $set: jsonNew
                }, (err, data)=>{
                    if (!err){
                        resolve(data)
                    }
                    reject(err)
                })
            })
        })
    }

    // 增加
    insert (collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db=>{
                db.collection(collectionName).insertOne(json,(err, doc)=>{
                    if (!err){
                        resolve(doc)
                    }
                    reject(err)
                })
            })
        })
    }

    // 删除
    remove (collectionName, json) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(collectionName).remove(json, (err, data)=>{
                    if (!err) {
                        resolve(data)
                    }
                    reject(err)
                })
            })
        })
    }
}

module.exports = Db.getInstance()
```

入口文件：`app.js`
```js
const app = new (require('koa'))
const router = new (require('koa-router'))
const Db = require('./modules/db')


// 查询
router.get('/', async ctx => {
    console.time('start')
    let data = await Db.find('user', {})
    console.log(data[1]._id) // 获取用户id

    console.timeEnd('start')
})

router.get('/news', async ctx => {
    console.time('start')
    let data = await Db.find('user', {})
    console.log(data)
    console.timeEnd('start')
})

// 添加
router.get('/add', async ctx => {
    let data = await Db.insert('user', {
        username: '赵芸',
        age: 20,
        sex: '女',
        status: 1
    })
    console.log(data)
})

// 更新
router.get('/update', async ctx => {
    let data = await Db.update('user',{username: '李四111'}, {
        username: '王五',
        age: 20,
        sex: '男',
        status: 1
    })
    console.log(JSON.parse(JSON.stringify(data)))
})

router.get('/del', async ctx=>{
    try {
        console.log(ctx.query)
        let data = await Db.remove('user', {username: '张三'})
        if (data.result.n == 1) {
            ctx.body = '删除成功'
        }else{
            ctx.body = '删除失败'
        }
    }catch(e) {
        ctx.body = e
    }
})


/*启动路由*/
app.use(router.routes())
    .use(router.allowedMethods());

app.listen(5000);
```

## 12. koa脚手架创建项目

通过应用`koa`脚手架生成工具	可以快速创建一个基于`koa2`的应用骨架

### 1. 全局安装
```shell
npm install koa-generator -g
```

### 2. 创建项目
```shell
koa koa_demo
```

### 3. 安装依赖
```shell
cd koa_demo
npm i
```

### 4. 启动项目
```shell
npm start
```

## 13. 自己搭建脚手架

代码为github内容