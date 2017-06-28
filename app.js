var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose')
var express = require('express');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var routes = require('./routes/routes'); //导入routes.js
var p_center = require('./routes/p_center'); //导入p_center.js
var uploadfile = require('./routes/file'); //导入file.js
var app = express();

app.use(bodyParser()); // 加载用于解析 cookie 的中间件
mongoose.Promise = global.Promise; //支持then
//数据库连接
var db=mongoose.connect("mongodb://127.0.0.1:27017/gene",function(err){
	if(err){
		console.log('连接失败')
	}else{
		console.log('连接成功')
	}
});

//设置session,必须写在使用route前
app.use(cookieParser()); // 加载用于解析 cookie 的中间件
app.use(session({
	secret: '12345',
	name: 'testapp', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
	cookie: {
		maxAge: 10000000000000
	}, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
	resave: false,
	saveUninitialized: true,
}));

app.use(express.static('public')); //public 目录下面的文件就可以访问了
routes(app); //调用routes传参数
p_center(app);
uploadfile(app);
//修改成html模板
app.set('views', __dirname + '/public'); //设置view的路径
app.set('view engine', 'ejs');
app.engine('.ejs', require('ejs').__express);

//服务器
var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});

//中间件
app.use(function(req, res, next) {
	if(!req.session.user) {
		if(req.url == "/login") {
			next(); //如果请求的地址是登录则通过，进行下一个请求  
		} 
	}
});
