$(document).ready(function(){

	function getQueryStringByName(name){
		var result=location.search.match(new RegExp("[\?\&]"+name+"=([^\&]+)", "i"));
		if(result==null||result.length<1){
			return "";
		}else{
			return result[1];
		}
	}
	function load(chapter_info){
		$("title").html(chapter_info.title);
		$(".chapter_title").html(chapter_info.title);
		$("#content").load("/books/"+type+"/"+book+"/"+chapter_info.url);
	}

	function reset(){
		type=getQueryStringByName("type");
		book=getQueryStringByName("book");
	 	chapter=getQueryStringByName("chapter");
	 	pre_chapter_info=current_book.chapters[parseInt(chapter)-1];
	 	chapter_info=current_book.chapters[parseInt(chapter)];
	 	post_chapter_info=current_book.chapters[parseInt(chapter)+1];
	}

	function addHistory(type,book,chapter){
		history.pushState({"chapter":chapter},"","/reader/?type="+type+"&book="+book+"&chapter="+chapter);
		reset();
		window.scrollTo(0,0);
	}

	var type=getQueryStringByName("type");
	var book=getQueryStringByName("book");
	var chapter=getQueryStringByName("chapter");
	var booktype;
	var current_book;
	var pre_chapter_info,
		chapter_info,
		post_chapter_info;
	switch(type){
		case "0":
			booktype="玄幻小说";
			break;
		case "2":
			booktype="仙侠小说";
			break;
		case "3":
			booktype="修真小说";
			break;
	}
	
	$.getJSON("/books/"+type+"/"+book+"/book.json",function(data){
		current_book=data;
		console.log(current_book);
		$(".book_type").html(booktype);
		$(".book_title").html(current_book.title);
		$(".book_title").attr("href","/book/?type="+type+"&book="+book);
		pre_chapter_info=current_book.chapters[parseInt(chapter)-1];
		chapter_info=current_book.chapters[parseInt(chapter)];
		post_chapter_info=current_book.chapters[parseInt(chapter)+1];
		console.log(chapter_info);
		load(chapter_info);
	})

	$(".pre_chapter_btn").click(function(){
		console.log(pre_chapter_info)
		load(pre_chapter_info);
		addHistory(type,book,parseInt(chapter)-1);
	});
	$(".post_chapter_btn").click(function(){
		console.log(post_chapter_info);
		load(post_chapter_info);
		addHistory(type,book,parseInt(chapter)+1);
	});
	$(".chapter_btn").click(function(){
		location.href="/book/?type="+type+"&book="+book;
	})
})

