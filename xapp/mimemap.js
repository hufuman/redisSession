
var path=require("path");


function getMime(pathname)
{
	var mimeMap = {
		".html" : "text/html",
		".htm" : "text/html",
		".js" : "text/javascript",
		".css" : "text/css",
	};

	var ext=path.extname(pathname);
	var mime = mimeMap[ext];
	if(!mime)
		mime = "text/plain";
	return mime;
}

exports.getMime=getMime;
