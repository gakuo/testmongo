// webサーバの設定
  var express = require("express");
  var app = express();
//app.set('view options', { layout : false });
//app.set('view engine',  'ejs');
var jquery = require("jsdom").jsdom;
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , routes   = require('./routes')
  , http     = require('http')
  , path     = require('path')
  , server   = http.createServer(app)
//  , io 	     = io.listen(server);
 server.listen(3000);
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine','ejs');
  app.use(express.favicon());
  app.use(express.cookieParser());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'ggggg'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// MongoDBサーバーの設定
var mongoose = require('mongoose');
var Schema =mongoose.Schema;
// Collectionのモデル定義
var UserModel = new Schema({
  username : { type: String },
  password : { type: String},
 // data :{ type: String},
  created_at : { type: String}
  }
);
var ClickModel = new Schema({
	clickx: {type:Number},
	clicky: {type:Number},
	user: {type:String},
	created_at : {type:Date,default : Date.now}
});
var Click = mongoose.model('click',ClickModel);
var click = new Click();
mongoose.model('UserModel', UserModel);
/*mongoose.model('User', {
    properties : [ 'userid', 'password', 'created_at' ],
    methods    : {
        save   : function (fn) {
            this.created_at = new Date();
            this.__super__(fn);
        }
    }
});*/

// mydb(database)への接続
var db = mongoose.connect('mongodb://localhost:27017/mydb');

    var User  = mongoose.model('UserModel');
    var user  = new User();
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
	  var log = console.log;
  log('connected');
  socket.emit('msg push', 'data');
  socket.on('msg send', function (msg) {
   	Click.update();
   	click.clickx=msg;
    click.save();
    log('いけてない');
  });
  socket.on('disconnect', function() { // 9
    log('disconnected');
  });
});app.configure('development', function(){
  app.use(express.errorHandler());
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		console.log('username: %s', username);
		console.log('password: %s', password);

		done(null, { username: username });

		// User.findOne(
		// 	{ username: username, password: password },
		// 	function (err, user) {
		// 		done(err, user);
		// 	}
		// );
	}
));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    done(null, { username: username });
});

app.get('/', routes.index);
app.get('/logiin', routes.index);
app.post(
	'/logiin',
	passport.authenticate('local', { failureRedirect: '/logiin' }),
	function(req,res){
		            console.log(req);

		
	var res_error = function (mes) {
       
        res.render('index', {
            locals : { message : mes}
            
        });
    };
    
    var res_success = function (mes) {
        res.render('main', {
            locals : {
                "message"  : mes,
                "username"   : username,
                "password" : password
            }
        });
    };

	var username     = req.param('username');
    var password   = req.param('password');
    var create_new = req.param('new');

    // useridが未記入時の処理
    if (! username) {
        res_error('not found "User ID"');
    }
    // passwordが未記入時の処理
    if (! password) {
        res_error('not found "password"');
    }

    var i     = { "username" : username };
    var j     = { "username" : username ,"password" : password};

console.log(i);
    // 新規ユーザアカウントの作成
    if (create_new) {
       User.findOne(i,function (err,doc) {
            console.log(doc);
            // 同一のアカウントがないので、mydbへ書き込みする
            if (doc == null) {
                user.username   = username;
                user.password = password;
                user.save();
				
           //     res_success('you get account.');

            }
            // 同一のアカウントがあるので、やり直し
            else {
                res_error('this accout is already gotten');
            }
        })

    }
    
        else {

        User.findOne(j,function (err,doc) {
            console.log(doc);
            if (doc == null) {
                res_error("UserID or passwrod is different.");
            } else {
                res_success('login success.');
            }
        });

    }

//    	res.redirect('/');
	}  );

app.get("/click" , function(req,res){
	//console.log(req);
			var datax = req.param('x');
			var datay = req.param('y');
			console.log(datax);
			click.clickx=datax;
			click.clicky=datay;
			click.user = req.session.passport.user;
			click.save();
			Click.findOne({},function(err,doc){
			console.log(doc);
			});
			//res.send(10,'done');
			/*
	User.findOne(req.session.passport,function(err,obj){
			var data     = req.param('data');
		var seta = obj;
		console.log(seta.data);
	seta.data = data;
	seta.save();

		});
	//res.send(200, 'done');
	res.render('main',         { 
		locals : {
                "message"  : 'login success.',
                "username"   : req.session.passport.user,
                "password" : req.session.passport.password
            }});*/
});

//app.listen(PORT);