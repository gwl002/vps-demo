var config =require("./config.js");

var ip=config.ip;
var port=config.port;
var mongo_host = config.dbhost;
var mongo_port = config.dbport;
var user=config.dbuser;
var passwd= config.dbpasswd;
var dbname=config.dbname;

var path=require("path");
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var express=require("express");
var app=express();
var server=require("http").createServer(app);
var io=require("socket.io",{transports: ['websocket']}).listen(server);
// var mongoURL="mongodb://"+mongo_host+":"+mongo_port+"/weixin";
// var mongoURL="mongodb://admin:c-WLBJhsgQGx@"+mongo_host+":"+mongo_port+"/weixin";
var mongoURL = "mongodb://"+user+":"+passwd+"@"+mongo_host+":"+mongo_port+"/"+dbname;

mongoose.connect(mongoURL,function(err){
	if(err){
		console.log(err);
	}else{
		console.log("Successfully connect to database "+mongoURL);
	}
})

app.set("view engine","jade");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
require("./common/model.js")();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    next();
});

app.use(function(req,res,next){
	console.log(req.url)
	var Counter=mongoose.model("Counter");
	Counter.findOne({},function(err,doc){
		if(err) {
			console.log(err);
		}
		if(!doc){
			var doc=new Counter({
				counter:1
			})
			
		}else{
			doc.counter+=1;
		}
		doc.save(function(err){
			if(err) throw err;
			res.locals.counter=doc.counter;
			next();
		})
		
	})	
})
require("./router/weixin.js")(app);
require("./router/snake.js")(app);
require("./router/chat.js")(app,io);
require("./router/reader.js")(app);
app.use(function(req,res){
    res.send("Page not found!")
})

server.listen(port,ip);
console.log("server is listening on %s : %s",ip,port);
