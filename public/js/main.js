$(document).ready(function(){
	var socket=io.connect();
	var $nickWrap=$("#nickWrap");
	var $contentWrap=$("#contentWrap");
	var $nickForm=$("#nickForm");
	var $nickName=$("#nickName");
	var $users=$("#users");
	var $messageForm=$("#send-message");
	var $message=$("#message");
	var $chatBox=$("#chat");
	var user=null;

	function resizeChatDiv(){
		if($chatBox[0].scrollHeight>$chatBox.height()){
			$chatBox[0].scrollTop=$chatBox[0].scrollHeight-$chatBox.height()+100;
		}
	}

	socket.on("login",function(data){
		var login_msg=data+"上线了！";
		 $.scojs_message(login_msg, $.scojs_message.TYPE_OK);
	})

	socket.on("logout",function(data){
		var logout_msg=data+"下线了！"
		 $.scojs_message(logout_msg, $.scojs_message.TYPE_ERROR);
	})

	socket.on("users",function(users){
		var html="";
		for(var i=0;i<users.length;i++){
			if(user==users[i].nick){
				html+='<li class="list-group-item list-group-item-success">'+users[i].nick+'</li>'
			}else{
				html+='<li class="list-group-item">'+users[i].nick+'</li>'
			}
			
		}
		$users.html(html);
	})

	socket.on("load old message",function(docs){
		for(var i=docs.length-1;i>=0;i--){
			if(docs[i].nick==user){
				$chatBox.append("<div style='overflow:hidden'><p class='pull-right text-success'>"+docs[i].nick+" : "+docs[i].msg+"</p></div>");
			}else{
				$chatBox.append("<div style='overflow:hidden'><p class='pull-left text-primary'>"+docs[i].nick+" : "+docs[i].msg+"</p></div>");
			}
		}
	})

	socket.on("msg",function(data){
		if(data.nick==user){
			$chatBox.append("<div style='overflow:hidden'><p class='pull-right text-success'>"+data.nick+" : "+data.msg+"</p></div>");
		}else{
			$chatBox.append("<div style='overflow:hidden'><p class='pull-left text-info'>"+data.nick+" : "+data.msg+"</p></div>")
		}
		resizeChatDiv();
		
	})

	$nickForm.submit(function(e){
		e.preventDefault();
		socket.emit("new user",$nickName.val(),function(data){
			if(data){
				$nickWrap.hide();
				$contentWrap.show();

			}else{
				$(".nickError").html("This nickname is already taken by others!Please try another one.")
			}
		});
		user=$nickName.val();
		$nickName.val("");
	})

	$messageForm.submit(function(e){
		e.preventDefault();
		socket.emit("new message",$message.val());
		$message.val("");
	})
})