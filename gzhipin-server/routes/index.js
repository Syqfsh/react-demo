var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/*
  ) 需求: a. 后台应用运行端口指定为 4000
  b. 提供一个用户注册的接口
   a) path 为: /register
   b) 请求方式为: POST
   c) 接收 username 和 password 参数
   d) admin 是已注册用户
   e) 注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’} f)
  注册失败返回: {code: 1, msg: '此用户已存在'}
 */

/*
  1.获取请求参数
  2.处理
  3.返回响应数据
 */
// router.post('/register', function (req, res, next) {
//     // 1.获取请求参数
//     console.log('register()');
//     const {username, password} = req.body
//     // 2.处理
//     console.log('register', username, password)
//     if (username === 'admin') { //注册会失败
//         //返回响应数据（失败）
//     res.send({code: 1, msg: '此用户已存在'})
// } else { //注册成功
//     res.send({code: 0, data: {_id: 'abc', username, password}})
//     }
// })
//引入md5加密函数库
const md5 = require('blueimp-md5')
const {UserModel} = require('../db/models')
const filter = {password:0,_v:0} //指定过滤的属性
//注册路由
router.post('/register',function (req,res) {
    //1，获取请求参数数据（username,password,type）
    const {username,password,type} = req.body

    //根据username查询数据库，看是否已存在user，如果存在，返回提示错误的信息，如果不存在，保存
    UserModel.findOne({username},function (err,user) {
        if(user){
            res.send({code:1,msg:'此用户已存在'})//code是数据是否是正常数据的标识
        }else{//保存注册数据
            new UserModel({username,type,password:md5(password)}).save(function (err,user) {
                //生成一个cookie（userid:user._id），并交给浏览器保存
                res.cookie('userid',user._id,{maxAge:1000*60*60*24*7})//持续化cookie，浏览器会保存在本地文件
                const data = {username ,type,_id:user._id}//响应数据中不要携带password
                //3.2.保存成功，返回成功的响应数据：user
                res.send({code:0,data})
            })
        }
    })
    //返回响应数据
})
//登陆的路由
router.post('/login',function (req,res) {
    // 获取请求参数数据（username,password）
    const {username,password} = req.body
    //2.处理数据 ：根据username 和 password去数据库得到user,如果没有，返回提示错误信息，如果有，返回登录成功信息
    UserModel.findOne({username ,password:md5(password)},filter,function (err,user) {
        if(user){
            //生成一个cookie（userid:user._id），并交给浏览器保存
            res.cookie('userid',user._id,{maxAge:1000*60*60*24*7})//持续化cookie，浏览器会保存在本地文件
            //返回登录成功信息，（包含user)
            res.send({code:0,data:user})
        }else{
            res.send({code:1,msg:'用户名或密码不正确'})
        }

    })


})

router.post('/update',function (req,res) {
    //得到请求cookie的userid
    const  userid = req.cookies.userid
    if (!userid){//如果没有，说明没有登录登陆，直接返回提示
        return res.send({code:1,msg:'请先登陆'})
    }
    //根据userid更新数据库中对应user文档数据
    const user = req.body //没有id
    UserModel.findByIdAndUpdate({_id:userid},user,function (error,oldUser) {//user是数据库中原来得数据
        if(!oldUser){
            //通知浏览器删除userid cookie
            res.clearCookie('userid')
            return res.send({code:1,msg:'请先登陆'})
        }else {
            const {_id,username,type} = oldUser
            //node端 ...不可用
            const data = Object.assign(user,{_id,username,type})
            //assign(obj1,obj2,obj3,...)//将多个指定的对象进行合并，返回一个合并的对象
             res.send({code:0,data})
        }

    })

})

router.get('/user',function (req,res) {
    //得到请求cookie的userid
    const  userid = req.cookies.userid
    if (!userid){//如果没有，说明没有登录登陆，直接返回提示
        return res.send({code:1,msg:'请先登陆'})
    }
    UserModel.findOne({_id:userid},filter,function (error,user) {
        return res.send({code:0,data:user})
    })

})
/*
  查看用户列表
 */
router.get('/userlist',function (req,res) {
    const {type} = req.query
    UserModel.find({type},function (error,users) {
        res.send({code:0,data:users})
        console.log(users)
    })

})
module.exports = router;
