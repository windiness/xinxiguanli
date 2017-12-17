//引入post集合操作方法
var Post = require('../model/Post');
module.exports = function (app) {
    //首页
    app.get('/',function (req,res) {
        var page = parseInt(req.query.page)||1;
        Post.getAll(null,function (err,docs,total) {
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            res.render('index',{
                docs:docs,
            })
        })

    })
    //添加页面
    app.get('/add',function (req,res) {
        res.render('add',{
            title:'添加'

        })
    })
    //添加行为
    app.post('/add',function (req,res) {
        var username = req.body.username;
        var name = req.body.name;
        var sex = req.body.sex;
        var age = req.body.age
        var tel = req.body.tel;
        var email = req.body.email;

        var newPeople = new Post({
            username:username,
            name:name,
            sex:sex,
            age:age,
            tel:tel,
            email:email
        })
        newPeople.save(function (err,user) {
            if(err){
                // req.flash('error',err);
                return res.redirect('/add');
            }
            console.log(user);
            req.session.user = newPeople;
            req.flash('success','添加成功');
            return res.redirect('/');
        })
    })
    //删除
    app.get('/delet/:time',function (req,res) {
        // console.log(req);
        Post.remove(req.params.time,function (err) {
            return res.redirect('/');
        })
    })
    //修改页面
    app.get('/edit/:time',function (req,res) {
        Post.edit(req.params.time,function (err,doc) {
            if(err){
                return res.redirect('/')
            }
            return res.render('edit',{
                doc:doc
            })
        })

    })
    //修改行为
    app.post('/edit/:time',function (req,res) {
        Post.update(req.body.username,req.body.name,req.body.sex,req.body.age,req.body.tel,req.body.email,req.params.time,function (err,doc) {
            // var url = encodeURI('/edit/' + req.params.name +'/' + req.params.title +'/' + req.params.time);
            if(err){
                // req.flash('error',err);
                return res.redirect('/');
            }
            // req.flash('success','修改成功');
            return res.redirect('/');
        })
    })
    //搜索
    app.get('/search',function (req,res) {
        Post.search(req.query.keyword,function (err,docs) {
            console.log(req.query.keyword)
            if(err){
                req.flash('error',err)
                return res.redirect('/');
            }
            return res.render('search',{
                docs:docs,
            })
        })
    })
}