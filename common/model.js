module.exports=function(){
	var mongoose=require("mongoose");
	var chatSchema=mongoose.Schema({
		nick:String,
		msg:String,
		created:{type:Date,default:Date.now}
	});

	var counterSchema=mongoose.Schema({
		counter:Number
	});

	var snakeSchema=mongoose.Schema({
		score:Number,
		nickname:String,
		created:{type:Date,default:Date.now}
	})

	var Chat=mongoose.model("Message",chatSchema);
	var Counter=mongoose.model("Counter",counterSchema);
	var Record=mongoose.model("Record",snakeSchema);
}