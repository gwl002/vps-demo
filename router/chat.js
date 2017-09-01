module.exports=function(app,io){
	var users=[];
	var mongoose=require("mongoose");
	var Chat=mongoose.model("Message");
	
	app.get("/chat",function(req,res){
		res.render("chat",{title:"chat test"});
	});

	io.sockets.on("connection",function(socket){

		socket.on("new user",function(data,callback){
			if(nick_exist(data)!==-1){
				callback(false);
			}else{
				callback(true);
				var user={};
	 			user.id=socket.id;
				socket.nickname=data;
				user.nick=data;
				users.push(user);
				socket.broadcast.emit("login",socket.nickname);
				io.sockets.emit("users",users);
				console.log(data+"login in");
				Chat.find({})
					.limit(10)
					.sort("-created")
					.exec(function(err,docs){
						if(err) throw err;
						socket.emit("load old message",docs);
					})
			}

		});

		socket.on("new message",function(msg){
			var newMsg=new Chat({
				msg:msg,
				nick:socket.nickname
			})
			newMsg.save(function(err){
				if(err) throw err;
				io.sockets.emit("msg",{nick:socket.nickname,msg:msg})
			})
		})

		socket.on("disconnect",function(data){
			var index=nick_exist(data);
			users.splice(index,1);
			io.sockets.emit("logout",socket.nickname);
			io.sockets.emit("users",users);
		})
	})

	function nick_exist(nick){
		for(var i=0;i<users.length;i++){
			if(nick===users[i].nick){
				return i;
			}
		}
		return -1;
	}

}