var fs=require("fs");
var debug=require("debug")("crawler");

exports.mkdir=function(folder){
	var mkdirp=require("mkdirp");
	mkdirp("public/books"+folder,function(err){
		if(err) console.error(err);
		else debug("pow!");
	})
}

exports.write_chapter=function(chapter,content,dirName){
	fs.writeFile("public/books"+dirName+"/"+chapter.url,content,function(err){
		if(err) throw err;
		debug("It is saved!");
	});
}

exports.write_config=function(book,dirName){
	var content=JSON.stringify(book,null,4);
	fs.writeFile("public/books"+dirName+"/book.json",content,function(err){
		if(err) throw err;
		debug("It is saved!");
	})
}
exports.write_list=function(booklist){
	var content=JSON.stringify(booklist,null,4);
	fs.writeFile("public/books/booklist.json",content,function(err){
		if(err) throw err;
		debug("It is saved!");
	})
}