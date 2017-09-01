var snake_body=null;
var direction=null;
var food_x=null;
var food_y=null;
var handler=null;
var flag=null;
var score=null;
var speed=null;
var nick=null;
var gameover=null;
var has_start=false;
var start_x,start_y,end_x,end_y;

window.onload=function(){
	var canvas=document.getElementById("canvas");
	var context=canvas.getContext("2d");
	var start=document.getElementById("start");
	var restart=document.getElementById("restart");
	var scoreDiv=document.getElementById("score");
	var nickDiv=document.getElementById("nick");
	var w=canvas.width/30;
	var h=canvas.height/30;

	initGame();

	start.onclick=function(event){
		if(!gameover){
			nick=prompt("请输入昵称");
			nickDiv.innerHTML=nick;
			has_start=true;
			handler=setInterval(function(){
				render();
				update();
			},speed);
		}
	}

	restart.onclick=function(event){
		clearInterval(handler);
		initGame();
		handler=setInterval(function(){
			render();
			update();
			
		},speed);

	}

	document.onkeydown=function(event){
			event=event||window.event;
			if(event.keyCode==38&&direction!="down")
				direction="up";
			else if(event.keyCode==39&&direction!="left")
				direction="right";
			else if(event.keyCode==40&&direction!="up")
				direction="down";
			else if(event.keyCode==37&&direction!="right")
				direction="left";
			else if(event.keyCode==80 && has_start==true){
				if (flag==1){
					flag=0;
					clearInterval(handler);
				}
				else {
					flag=1;
					handler=setInterval(function(){
							render();
							update();
					},speed);
				}
			}
				
	}

	document.addEventListener("touchstart",touch,false);
	document.addEventListener("touchend",touch,false);

	function touch(e){
		var event=e||window.event;
		switch(event.type){
			case "touchstart":
				start_x=event.touches[0].pageX;
				start_y=event.touches[0].pageY;
				break;
			case "touchend":
				end_x=event.touches[0].pageX;
				end_y=event.touches[0].pageY;
				detX=end_x-start_x;
				detY=end_y-start_y;
				if(detX>0 && Math.abs(detX)>Math.abs(detY)){
					direction="right";
				}
				else if(detX<0 && Math.abs(detX)>Math.abs(detY)){
					direction="left";
				}
				else if(detY<0 && Math.abs(detX)<Math.abs(detY)){
					direction="up";
				}
				else if(detY>0 && Math.abs(detX)<Math.abs(detY)){
					direction="down";
				}

		}

	}

	function initGame(){
		snake_body=[[5,6],];
		direction="right";
		food_x=3;
		food_y=3;
		flag=1;
		score=0;
		gameover=false;
		speed=200;
		render();
	}
	
		

	function render(){
		context.clearRect(0,0,canvas.width,canvas.height);
		draw_grid();
		draw_snake();
		draw_rect(context,food_x,food_y,"red");
	}

	function update(){
		var head=snake_body[0];
		var new_=[head[0],head[1]];
		if (direction=="right")
			new_[0]=(head[0]+1);
		else if(direction=="left")
			new_[0]=(head[0]-1);
		else if(direction=="down")
			new_[1]=(head[1]+1);
		else if(direction=="up")
			new_[1]=(head[1]-1);

		next=[new_[0],new_[1]];

		if(next[0]>13 || next[0]<0 || next[1]>13 || next[1]<0){
			clearInterval(handler);
			gameover=true;
			alert("Your snake hit the border.Game over!");
			uploadRecord(nick,score);
		}

		else if(in_body(next[0],next[1])){
			clearInterval(handler);
			gameover=true;
			alert("Your snake bite itself.Game over!");
			uploadRecord(nick,score);
		}

		else if (next[0]==food_x&&next[1]==food_y){
			snake_body.unshift(next);
			score++;
			scoreDiv.innerHTML=score;
			change_food();
		}
		else{
			snake_body.pop();
			snake_body.unshift(next);
		}

	}


	function draw_snake(){
		for(var i=0;i<snake_body.length;i++){
			draw_rect(context,snake_body[i][0],snake_body[i][1],"blue");
		}
	}

	function change_food(){
		var x=Math.floor(Math.random()*(w-1));
		var y=Math.floor(Math.random()*(h-1));
		while (in_body(x,y)){
			x=Math.floor(Math.random()*(w-1));
			y=Math.floor(Math.random()*(h-1));
		}
		food_x=x;
		food_y=y;
		
	
	}

	function in_body(x,y){
		for(var i=0;i<snake_body.length;i++){
			if(x==snake_body[i][0]&&y==snake_body[i][1])
				return true;
		}
		return 	false;
	}

	function draw_grid(){
		context.beginPath();
		context.strokeStyle="#565656";
		
		for(var i=0;i<w;i++){
			context.moveTo(15,15+i*30);
			context.lineTo(435,15+i*30);
			context.stroke();
		}
		for(var j=0;j<h;j++){
			context.moveTo(15+j*30,15);
			context.lineTo(15+j*30,435);
			context.closePath();
			context.stroke();
		}
	}

	function draw_rect(cxt,i,j,color){
		cxt.fillStyle=color;
		cxt.fillRect(16+i*30,16+j*30,29,29);
	}

	function uploadRecord(nickname,score){
		var data={nickname:nickname,score:score};
		$.ajax({
			type:"POST",
			url:"/snake/record",
			data:data,
			dataType:"json",
			success:function(data){
				if(data.isNew){
					alert(data.nick+"欢迎你来玩js版贪吃蛇！第一次就获得"+data.score+"分。真厉害！再接再厉哦！")
				}
				else{
					if(data.rewrite){
						alert(data.nick+"恭喜你获得"+data.score+"分打破原有纪录"+data.record+"分！")
					}else{
						alert(data.nick+"你获得"+data.score+"分。没有打破你原有纪录"+data.record+"分!继续努力吧！")
					}
				}
			},
			error:function(){
				alert("异常！");
			}
		})
	}

}