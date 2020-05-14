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