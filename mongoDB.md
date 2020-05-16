## 1. 数据库操作

### 1. 使用数据库、创建数据库

```sql
use itying
```

如果真的想把这个数据库创建成功，那么必须插入一个数据

数据库中不能直接插入数据，只能往集合`(collections)`中插入数据。下面命令表示给`itying`数据库中的`user`表中插入数据。

```sql
db.user.insert({'name': '小名'});
```

### 2.  查看数据库

```sql
show dbs
```

### 3. 显示当前的数据集合(`mysql` 中叫表)

```sql
show collections
```

### 4. 删除集合，删除指定的集合，删除表

```sql
# 删除集合 db.COLLECTION_NAME.dorp()
db.user.drop()
```

### 5. 删除数据库

```sql
db.dropDatabase()
```

## 2. 插入数据

插入数据，随着数据的插入，数据库创建成功了，集合也创建好了

```sql
db.表名.insert({"name": "张三", "age": 20})
```

## 3. 查找数据

### 1. 查询所有记录

```sql
db.user.find()
```

相当于：`select * from user;`

### 2. 查询去掉后的当前聚集集合中的某列的重复数据

```sql
db.user.distinct("name")
```

会过滤掉`name`中相同的数据

相当于：`select distinct name from user`

### 3. 查询`age=22`的记录

```sql
db.user.find({"age": 22})
```

相当于：`select * from user where age=22;`

### 4. 查询`age>22`的记录

```sql
db.user.find({age:{$gt:22}})
```

相当于：`select * from user where age>22`

### 5. 查询`age<22`的记录

```sql
db.user.find({age: {$lt:22}})
```

相当于：`select * from user where age<22`

### 6. 查询`age>=25`的记录

```sql
db.user.find({age: {$gte: 10}})
```

### 7. 查询`age<=25`的记录

```sql
db.user.find({age: {$lte: 20}})
```

### 8. 查询`age>=13`且`age<=33`的记录 

注意书写格式

```sql
db.user.find({age: {$gte: 13, $lte: 33}})
```

### 9. 查询`name`中包含`mongo`的数据

模糊查询用于搜索

```sql
db.user.find({name: /mongo/});
```

相当于`%%`

`select * from user where name like '%mongo%'`

### 10. 查询`name`中以`mongo`开头的

```sql
db.user.find({name: /^mongo/})
select * from user where name like '%mongdo%'
```

### 10. 查询指定列`name`，`age`的数据

```sql
db.user.find({name: 1, age: 1})
```

相当于：`select name,age from user`

当然`name`也可以用`true`或`false`，当用`true`的情况下河`name: 1`效果一样，如果用`false`就是排除`name`，显示`name`意外的消息

### 11. 查询指定列`name`，`age`数据，`age>25`

```sql
db.user.find({age: {$gt: 25}},{name: 1, age: 1})
# 相当于
select name, age from user where age>25
```

### 12. 按照年龄排序

`1： 升序，-1：降序`

升序

```sql
db.user.find().sort({age: 1})
```

降序

```sql
db.user.find().sort({age: -1})
```

### 13. 查询`name=zhangsan,age=22`的数据

```sql
db.user.find({name: '张三'， age: 22})
# 相当于
select * from user where name='张三' and age=22
```

### 15. 查询前5条数据

```sql
db.user.find().limit(5)
# 相当于
select top5 * from user
```

### 16. 查询10条以后的数据

```sql
db.user.find().skip(10)
```

## 4. 索引基础
### 1. 索引
索引是对数据库表中一列或多列的值进行排序的一种结构，可以让我们查询数据库变得更快。`MongoDB`的索引几乎与传统的关系型数据库一模一样，这其中也包括一些基本的查询优化技巧。
下面是创建索引的命令：
```sql
db.user.ensureIndex({username: 1})
```
获取当前集合的索引：
```sql
db.user.getIndexes()
```
删除索引的命令是：
```sql
db.user.dropIndex({username: 1})
```
在`MongoDB`中，我们同样可以创建复合索引，如：
**数字1** ，表示`username`键的索引按升序排列，-1表示`age`键的索引按照降序方式存储
```sql
db.user.ensureIndex("username": 1, "age": -1)
```
该索引被创建后，基于`username`和`age`的查询将会用到该索引，或者是基于`username`的查询也会用到该索引，**但是只是基于`age`的查询将不会用到该复合索引。因此可以说，查询如果想用到索引，必须在查询条件中包含复合索引中的前`N`个索引列**。然而如果查询条件中的键值顺序和复合索引中的创建顺序不一致的话，`MongDB`可以智能的帮助我们调整该顺序，以便复合索引可以为查询所用。如：
```sql
db.user.find({"age":30, "username": "stephen"})
```
对于上面示例中的查询条件，`MongoDB`在检索之前将会动态的调整查询条件文档的顺序，以使该查询可以用到刚刚创建的复合索引。
对于上面的索引，`MongoDB`都会根据索引的`keyname`和索引方向为新创建的索引自动分配一个索引名，下面的命令可以在创建索引时为其指定索引名。如：
```sql
db.user.ensureIndex({username: 1}, {name: "userindex"})
```
> 随着集合的增长，需要针对查询大量的排序做索引。如果没有对索引的键调用`sort`，`MongoDB`需要将所有的数据提取到内存并排序。因此在做无索引排序时，如果数据量过大以致无法在内存中进行排序，此时`MongoDB`将会报错

### 2. 唯一索引

在缺省情况下创建的索引值不是唯一的索引。下面的示例将创建唯一的索引，如：
```sql
db.user.ensureIndex({userid: 1}, {unique: true})
```
如果再次插入`userid` | 重复的文档时， `MongoDB`将报错，以提示插入重复键，如：
```sql
db.user.insert({userid: 5})
db.user.insert({userid: 5})
E11000 duplicate key error index: user.user.$userid_1 dup key:{:5.0}
```

如果在创建唯一索引时已经存在了重复项，我们可以通过下面的命令帮助我们在创建唯一索引时消除重复文档，仅保留发现的第一个文档，如：
```sql
db.user.dropIndex({userid: 1})
```

### 2.` explain executionStats` 查询具体的执行时间

```sql
db.tablename.find().explain("executionStats")
关注输出的如下数值：explain.executionStats.executionTimeMillis
```

## 3. MongoDB 账户权限配置
### 创建管理员用户
1. 第一步创建超级管理员用户
```sql
use admin
db.createUser({
	user: 'admin',
	password: '123456'
	roles: [{role: 'root', db: 'admin'}]
})
```
2. 第二步修改Mongodb数据库配置文件
```sql
路径：C:\Program Files\MongoDB\Server\4.0\bin\mongod.cfg
配置：
​```sql
security:
    authorization: enabled
```
3. 第三步重启`mongodb`服务

![1588400364049](assets/1588400364049.png)

4. 第四部用超级管理员账户连接数据库
```sql
mongo admin -u 用户名 -p 密码
mongo 192.168.1.200:27017/test/-u user -p password
```
5. 第五步给`eggcms`数据库创建一个用户 	只能访问`eggcms`不能访问其他数据库
```sql
use eggcms

db.createUser({
    user: 'eggadmin',
    pwd: "123456",
    roles: [{role: 'dbOwner', db: 'eggcms'}]
})
```
### 3. `Mongodb`账户权限配置中常用的命令
```sql
1. show users;		# 参看当前库下的用户
```
```sql
2. db.dropUser("eggadmin");		# 删除用户
```
```sql
3. db.updateUser("admin", {pwd: "password"});		# 修改用户密码
```
```sql
4. db.auth("admin", "password");		# 密码认证
```

### 4. `MongoDB`数据库角色
1. 数据库用户角色：`read, readWrite`
2. 数据库管理角色：`dbAdmin, dbOwner, userAdmin`
3. 集群管理角色：`clusterAdmin, clusterManager, clusterMonitor, hostManager`
4. 备份恢复角色：`backup, restore`;
5. 所有数据库角色：`readAnyDatabase, readWriteAnybase, userAdminAnyDatabase, dbAdminAnyDatabase`
6. 超级用户角色：`root`

### 5. 连接数据库的时候需要配置账户密码
```js
const url = 'mongodb://admin:123456@localhost:27017';
```

## 5. 表与表之间的关系
### 1. 简述关系数据库中表与表的3种关系
1. 一对一的关系
	例如：一个人对应一个唯一的身份证号，即为一对一的关系
2. 一对多的关系
	例如：一个班级对应多名学生，即为一对多的关系
3. 多对多的关系
	例如：一个学生可以选多门课程，而同一门课程可以被多个学生选修，彼此的对应关系

### 2. 一对一的关系

![1588733892947](assets/1588733892947.png)

### 3. 一对多的关系

![1588734055621](assets/1588734055621.png)

![1588734077630](assets/1588734077630.png)

![1588734182175](assets/1588734182175.png)

### 4. 多对多的关系

![1588734312157](assets/1588734312157.png)

![1588734678597](assets/1588734678597.png)

## 6. MongoDB多表关联查询

### 1. `mongoDB` 聚合管道

使用聚合管道可以对集合中的文档进行变换和组合

实际项目：表关联查询，数据的统计。

`MongoDB`中使用`db.COLLECTION_NAME.aggregate([{<stage>}, ....])`方法来构建和使用聚合管道。先看下官网给的实例，感受一下聚合管道的用法。

![1588735226036](assets/1588735226036.png)

![1588735237072](assets/1588735237072.png)

#### 1.  管道操作符

| 管道操作符 | Description                                          | 例       |
| :--------: | ---------------------------------------------------- | -------- |
|  $project  | 增加，删除，重命名字段                               | id, name |
|   $match   | 条件匹配。只满足条件的文档才能进入下一阶段           |          |
|   $limit   | 限制结果的数量                                       |          |
|   $skip    | 跳过文档的数量                                       |          |
|   $sort    | 条件排序                                             |          |
|   $group   | 条件组合结果                                         |          |
|  $lookup   | $lookup 操作符，用以引入其他集合的数据（表关联查询） |          |

#### 2. `sql` 和 `nosql` 对比

| SQL      | NOSQL    |
| -------- | -------- |
| where    | $match   |
| group by | $group   |
| having   | $match   |
| select   | $project |
| order by | $sort    |
| limit    | $limit   |
| sum()    | $sum     |
| count()  | $sum     |
| join()   | $lookup  |

#### 3. 管道表达式

管道操作符作为“键”，所以对应的“值”叫做管道表达式

例如{$match:{status: "A"}}，`$match`称为管道操作符，而`status: "A"`称为管道表达式，是管道操作符的操作数（Operand）

每个管道表达式是一个文档结构，它是由字段名，字段值，和一些表达式操作符构成的。

### 2. 数据模拟

```sqlite
db.order.insert({"order_id":"1", "uid": 10, "trade_no": "111", "all_price": 100, "all_num": 2})
db.order.insert({"order_id":"2", "uid": 7, "trade_no": "222", "all_price": 90, "all_num": 2})
db.order.insert({"order_id": "3", "uid": 9, "trade_no": "333", "all_price": 20, "all_num": 6})

db.order_item.insert({"order_id": "1", "title": "商品鼠标1", "price": 50, num: 1})
db.order_item.insert({"order_id": "1", "title": "商品键盘2"，"price": 50, num: 1})
db.order_item.insert({"order_id": "1", "title": "商品键盘3"，"price": 0, num: 1})

db.order_item.insert({"order_id": "2", "title": "牛奶", "price": 50, num: 1})
db.order_item.insert({"order_id": "2", "title": "酸奶", "price": 40, num: 1})

db.order_item.insert({"order_id": "3", "title": "矿泉水", "price": 2, num: 5})
db.order_item.insert({"order_id": "3", "title": "毛巾", "price": 10, num: 1})
```

![1588738016264](assets/1588738016264.png)

### 3. $project

修改文档的结构，可以用来重命名，增加或删除文档中的字段。

要求查找`order`只返回文档中`trade_no`和`all_price`字段

```sqlite
db.order.aggregate([
    {
    	$project: { order_id: 1, trade_no: 1, all_price: 1}
    }
])
```

### 4. $match

作用
用于过滤文档。用法类似于`find()`方法中的参数。

```sqllite
db.order.aggregate([
	{
		$project: { order_id: 1, trade_no: 1, all_price: 1 }
	},
	{
		$match: {"all_price":{$gte: 90}}
	}
])
```

### 5. $group

将集合中的文档进行分组，可用于统计结果。

统计每个订单的订单数量，按照订单号分组。

```sqlite
db.order_item.aggregate([
    {
    	$group: {
    		_id: "$order_id",
    		total: {
    			$sum: "$num"
    		}
    	}
    }
])
```

### 6. $sort

将集合中的文档进行排序

```sqlite
db.order.aggregate([
    {
    	$project: {trade_no: 1, all_price: 1}
    },
    {
    	$match: {"all_price": {$gte: 90}}
    },
    {
    	$sort: {"all_price": -1}
    }
])
```

### 7. $limit

```sqlite
db.order.aggregate([
    {
    	$project: {trade_no: 1, all_price: 1}
    },
    {
    	$match: {"all_price": 90}
    },
    {
    	$sort: {"all_price": -1}
    },
    {
    	$limit: 1
    }
])
```

### 8.$skip

```sqlite
db.order.aggregate([
    {
    	$project: {trade_no: 1, all_price: 1}
    },
    {
    	$match: {"all_price": {$gte: 90}}
    },
    {
    	$sort: {"all_price": -1}
    },
    {
    	$skip: 1
    }
])
```

### 9. $lookup表关联

```sqlite
db.order.aggregate([
    {
    	$lookup: {
    		from: "order_item",
    		localField: "order_id",
    		foreignField: "order_id",
    		as: "items"
    	}
    }
])
```

```json
{
	"_id": ObjectId("5eb23610f9e143b9381962a6"),
	"order_id": "1",
	"uid": 10,
	"trade_no": "111",
	"all_price": 100,
	"all_num": 2,
	"items": [{
				"_id": ObjectId("5eb23628f9e143b9381962a9"),
				"order_id": "1",
				"title": "商品鼠标1",
				"price": 50,
				"num": 1
			}, {
				"_
				id " : ObjectId("
				5e b23696f9e143b9381962aa "), "
				order_id " : "
				1 ", "
				title " : "
				商品鼠标2 ", "
				pr
				ice " : 50, "
				num " : 1 } ] } {
					"_id": ObjectId("5eb23619f9e143b9381962a7"),
					"order_id": "2",
					"uid": 7,
					"trade_no": "222",
					"all_price": 90,
					"all_num": 2,
					"items": [{
								"_id": ObjectId("5eb2369ef9e143b9381962ab"),
								"order_id": "2",
								"title": "牛奶",
								"price": 50,
								"num": 1
							}, {
								"_id": O
								bjectId("5eb236a3f9e143b9381962ac"),
								"order_id": "2",
								"title": "酸奶",
								"price": 40,
								"
								num " : 1 } ] } {
									"_id": ObjectId("5eb2361ff9e143b9381962a8"),
									"order_id": "3",
									"uid": 9,
									"trade_no": "333",
									"all_price": 20,
									"all_num": 6,
									"items": [{
										"_id": ObjectId("5eb23703f9e143b9381962ad"),
										"order_id": "3",
										"title": "矿泉水",
										"price": 2,
										"num": 5
									}, {
										"_id": ObjectId("5eb23708f9e143b9381962ae"),
										"order_id": "3",
										"title": "毛巾",
										"price": 10,
										"num": 1
									}]
								}
```

### 10 案例

```sqlite
db.order.aggregate([
    {
    	$lookup: {
    		from: "order_item",
    		localField: "order_id",
    		foreignField: "order_id",
    		as: "items"
    	}
    },
    {
    	$match: {"all_price": {$gte: 90}}
    }
])
```

```sqlite
db.order.aggregate([
    {
    	$lookup: {
    		from: "order_item",
    		localField: "order_id",
    		foreignField: "order_id",
    		as: "items"
    	}
    },
    {
    	$project: {trade_no: 1, all_price: 1, item: 1}
    },
    {
    	$match: {"all_price": {$gte: 90}}
    },
    {
    	$sort: {"all_price": -1}
    }
])
```

