var mongodb = require('./db');
function formatDate(num) {
    return num < 10 ? '0' + num : num;
}
//
function Post(user) {
    this.username = user.username;
    this.name = user.name;
    this.sex = user.sex;
    this.age = user.age;
    this.tel = user.tel;
    this.email = user.email;
}
Post.prototype.save = function (callback) {
    // 1.格式化时间
    var date = new Date();
    var now = date.getFullYear() + '-' + formatDate(date.getMonth() + 1) + '-' +
        formatDate(date.getDate()) + ' ' + formatDate(date.getHours()) + ':' +
        formatDate(date.getMinutes()) + ':' + formatDate(date.getSeconds());
    // 2.收集数据
    var newContent = {
        username:this.username,
        name:this.name,
        sex:this.sex,
        age:this.age,
        tel:this.tel,
        email:this.email,
        time:now,
    }
    // 3.打开数据库
    // 4.读取posts集合
    // 5.将数据插入到集合中，并跳转到首页
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(newContent,function (err,doc) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,doc);
            })
        })
    })
}
//获取信息
Post.getAll = function (name,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {}
            if(name){
                query.name = name;
            }

                collection.find(query).sort({time: -1}).toArray(function (err, docs) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    //将每篇文章在读取的时候以markdown的格式进行解析
                    // docs.forEach(function(doc){
                    //     doc.content = markdown.toHTML(doc.content);
                    // })
                    return callback(null,docs);
                })
        })
    })
}
//删除
Post.remove = function (time,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.remove({
                time:time
            },{
                w:1
            },function (err) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null);
            })
        })
    })
}
//修改
Post.edit = function (time,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                time:time
            },function (err,doc) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,doc);
            })
        })
    })
}
//更新
Post.update = function (username,name,sex,age,tel,email,time,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.update({
                // name:cname,
                time:time
            },{
                $set:{username:username,name:name,sex:sex,age:age,tel:tel,email:email}
            },function (err,doc) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,doc);
            })
        })
    })
}

Post.search = function (keyword,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('posts',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            var sea={}
            if(isNaN(keyword - 0)){
                var newRegex = new RegExp(keyword,'i');
                sea.name = newRegex;
                console.log(sea.name);
            }else {

                var newRegex = new RegExp(keyword,'g');
                sea.age = newRegex;
                console.log(sea.age);
            }
            collection.find(sea,{
                username:1,
                name:1,
                sex:1,
                age:1,
                tel:1,
                email:1,
                time:1

            }).sort({time:-1}).toArray(function (err,docs) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,docs)
            })
        })
    })
}
module.exports = Post;