var fs=require("fs");
var cp=require("child_process");
var url="http://www.biquku.com";
var updateOne=require("../common/crawler.js").updateOne;
var update=require("../common/crawler.js").update;

module.exports=function(app){
	app.get("/reader",function(req,res){
		res.render("reader/reader");
	})

	app.get("/book",function(req,res){
		var type=req.query.type;
		var book=req.query.book;
		fs.readFile("public/books/"+type+"/"+book+"/book.json",function(err,data){
			if(err){
				res.render("reader/error");
			}else{
				var bookinfo=JSON.parse(data.toString("utf-8"));
				bookinfo.type=type;
				bookinfo.book=book;
				res.render("reader/book",{book:bookinfo,title:bookinfo.title});
			}
		})
	})

	app.get("/novellist",function(req,res){
		fs.readFile("public/books/booklist.json",function(err,data){
			
			if(err){
				res.render("reader/error");
			}else{
				var list=JSON.parse(data.toString("utf-8"));
				res.render("reader/novellist",{list:list,title:"gwl002 novel website"});
			}
		})
	})

	app.get("/update",function(req,res){
		// var child=cp.fork("./crawler.js");
		update();
		res.send("starting crawler fetch pages from targetWebsite!");
	})

	app.get("/updateOne",function(req,res){
		var type=req.query.type;
		var book=req.query.book;
		updateOne(url+"/"+type+"/"+book);
		res.send("starting crawler book /"+type+"/"+book+"!");
	})

}