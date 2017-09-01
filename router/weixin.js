module.exports=function(app){
	app.get("/",function(req,res){
		res.render("index",{title:"weixin & chat test page",counter:res.locals.counter||0} );
	})
	app.get("/interface",function(req,res){
		var checksignature=require("../common/checksignature.js");
		if(checksignature(req,res)){
			res.send(req.query.echostr)
		}else{
			res.send("You are not a wexin Server!")
		}
	})
	app.post("/interface",function(req,res){
		var post_data="";
		req.on("data",function(data){
			post_data=data;
		})
		req.on("end",function(){
			var xmlStr=post_data.toString("utf-8",0,post_data.length);
			var ToUserName="";
			var FromUserName="";
			var CreateTime="";
			var MsgType="";
			var Content="";
			var tempName="";

			var xml=require("node-xml");
			var parse=new xml.SaxParser(function(cb){
				cb.onStartElementNS(function(elem,attra,prefix,uri,namespace){
					tempName=elem;
				});
				cb.onCharacters(function(chars){
					chars=chars.replace(/(^\s*)|(\s*$)/g,"");
					if(tempName="CreateTime"){
						createTime=chars;
					}
				});
				cb.onCdata(function(cdata){
					if(tempName=="ToUserName"){
						ToUserName=cdata;
					}else if(tempName=="FromUserName"){
						FromUserName=cdata;
					}else if(tempName=="MsgType"){
						MsgType=cdata;
					}else if(tempName=="Content"){
						Content=cdata;
					}
					console.log(tempName+":"+cdata);
				});
				cb.onEndDocument(function(elem,prefix,uri){

				});
			})

			parse.parseString(xmlStr);
			CreateTime=parseInt(new Date().getTime()/1000);
			var msg="";
			switch(MsgType){
				case "text":
					msg="谢谢关注，你说的是:"+Content;
					break;
				case "voice":
					msg="对不起，无法识别你说话的内容";
					break;
				case "image":
					msg="你长得真漂亮";
					break;
			}
			var sendMessage='\
						<xml>\
						<ToUserName><![CDATA['+FromUserName+']]></ToUserName>\
						<FromUserName><![CDATA['+ToUserName+']]></FromUserName>\
						<CreateTime>'+CreateTime+'</CreateTime>\
						<MsgType><![CDATA[text]]></MsgType>\
						<Content><![CDATA['+msg+']]></Content>\
						</xml>';
			res.send(sendMessage);
		})
	})
}