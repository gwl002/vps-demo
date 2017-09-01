var url="http://www.biquku.com";
var Crawler=require("crawler");
var fs=require("fs");
var utils=require("./utils.js");

var c = new Crawler({
    maxConnections : 10,
    jQuery:true,
    forceUTF8:true,
    // This will be called for each crawled page
    callback : function (error, result, $) {
    	var lists=$("#main .novelslist .content ul").eq(1);
    	lists=lists.find("li a");
    	var booklist=[];
    	for(var i=0;i<lists.length;i++){
    		var book=$(lists[i]);
    		var obj={};
    		obj.title=book.text();
    		var url=book.attr("href").match(/\/(\d+)\/(\d+)/);
    		obj.type=url[1];
    		obj.book=url[2];
    		booklist.push(obj);
    		getOneBook(book.attr("href"),0);
    	}
    	utils.write_list(booklist);

    }
});



function startCrawler(){
	c.queue(url);
}

function getOneBook(book,flag){
	console.log("starting crawler "+book);
	var current_book={};
	c.queue([{
		uri:book,
		jQuery:true,
		forceUTF8:true,
		callback:function(err,result,$){
			var urls=$("#list a");
			var matches=book.match(/\/(\d+)\/(\d+)/);
			var dirName=matches[0];
			var typeNum=matches[1];
			var bookNum=matches[2];
			utils.mkdir(dirName);
			current_book.title=$("#maininfo h1").text();
			current_book.author=$("#info p").eq(0).text();
			current_book.update_time=$("#info p").eq(2).text();
			current_book.latest_chapter=$("#info p").eq(3).text();
			current_book.intro=$("#intro").text();
			current_book.chapters=[];
			
			for(var i=0;i<urls.length;i++){
					var url=urls[i];
					var _url=$(url).attr("href")+"";
					var num=_url.replace(".html","");
					var title=$(url).text();
					current_book.chapters.push({
						num:num,
						title:title,
						url:_url
					})
			}

			var len=current_book.chapters.length
			for(var i=0;i<len;i++){
			   getOneChapter(current_book.chapters[i],dirName,i,len,current_book.title);
			}

			setTimeout(function(){
			    utils.write_config(current_book,dirName);
			},5000);

			if(flag==1){
				fs.readFile("public/books/booklist.json",function(err,data){
					
					if(err){
						console.log(err);
					}else{
						var list=JSON.parse(data.toString("utf-8"));
						var newbook={};
						newbook.title=current_book.title;
						newbook.type=typeNum;
						newbook.book=bookNum;
						list.push(newbook);
						utils.write_list(list);

					}
				})
			}
		
		}
	}])
}

function getOneChapter(chapter,dirName,i,len,title){
	c.queue([{
		uri:url+dirName+"/"+chapter.url,
		jQuery:true,
		forceUTF8:true,
		callback:function(err,result,$){
			try{
				if(i==len-1){
					console.log(title+"	is 100% completed!");
				}
				var content=$("#content").html()||"";
				content=convertChar(content);
				utils.write_chapter(chapter,content,dirName);
				console.log(chapter);
			} catch(e){
				console.error(e);
			}
			
		}
	}]);
}

function convertChar(html){
	return html.replace(/&#(x)?(\w+);/g,function($,$1,$2){
       	return String.fromCharCode(parseInt($2,$1?16:10));
       });
}

module.exports.updateOne=function(book){
	getOneBook(book,1);
};
module.exports.update=startCrawler;