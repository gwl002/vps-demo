var mongoose=require("mongoose");
var Record=mongoose.model("Record");
var record=null;

module.exports=function(app){
	app.get("/snake",function(req,res){
		Record.find({})
			.sort("-score")
			.exec(function(err,docs){
				if(err){
					throw err;
				}
				else{
					if(docs.length==0){
						record="无";
					}else{
						record=docs[0].score;
					}
					res.render("snake",{title:"js版贪吃蛇",record:record});
				}
			})
	})

	app.post("/snake/record",function(req,res){
		var nickname=req.body.nickname;
		var score=req.body.score;
		Record.findOne({nickname:nickname},function(err,doc){
			if(err){
				throw err;
			}else{
				if(!doc){
					var newNick=new Record({
						nickname:nickname,
						score:score
					});
					newNick.save(function(err){
						if(err) throw err;
						console.log("保存成功！ "+nickname+" scored "+score+".")
						res.json({
							isNew:true,
							nick:nickname,
							score:score
						})
					})
				}else{
					var last=doc.score;
					if(doc.score>=score){
						console.log(nickname+" scored "+score+".没有打破纪录！")
						res.json({
							isNew:false,
							nick:nickname,
							rewrite:false,
							record:last,
							score:score
						})
					}else{
						doc.score=score;
						doc.save(function(err){
							if(err) throw err;
							console.log(nickname+" scored "+score+"打破纪录 "+last+"分.")
							res.json({
								isNew:false,
								nick:nickname,
								rewrite:true,
								record:last,
								score:score
							})
						})

					}
				}

			}
		})
	})
}