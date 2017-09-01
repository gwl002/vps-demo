module.exports=function(req,res){
	var token="weixin";
		var signature=req.query.signature;
		var timestamp=req.query.timestamp;
		var echostr=req.query.echostr;
		var nonce=req.query.nonce;

		var oriArray=[];
		oriArray[0]=nonce;
		oriArray[1]=timestamp;
		oriArray[2]=token;
		oriArray.sort();

		var jsSHA=require("jssha");
		var original=oriArray.join("");
		var shaObj=new jsSHA(original,"TEXT");
		var scyptoString=shaObj.getHash("SHA-1","HEX");
		if(signature==scyptoString) return true;
		else { return false;}
}