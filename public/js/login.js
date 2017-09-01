$(document).ready(function(){
	var loginBtn=$("#loginBtn");
	var registerBtn=$("#registerBtn");
	
	loginBtn.click(function(){
		if(window.logined){
			return;
		}
		var cookieName= "userid";
		var date = new Date();
		var dateTimeNow = date.getTime();
		var userid = "gwl"+dateTimeNow;
		var cookiePath= "/";

		var expirationTime = 172800*15;
		expirationTime = expirationTime * 1000;

		
		date.setTime(dateTimeNow + expirationTime);

		var expirationTime = date.toUTCString();
		document.cookie = cookieName + "=" + userid + ";expires=" + expirationTime + ";path=" + cookiePath;
		window.logined = true;
	})

	registerBtn.click(function(){
		document.cookie = "userid=;Max-Age=0";
		window.logined=false;
	})
})
