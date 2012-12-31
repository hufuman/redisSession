
var http=require("http");
var fs=require("fs");
var error=require("./error");
var mimemap=require("./mimemap");

function get(pathname, request, response)
{
	pathname = pathname.replace("\\", "/");
	pathname = "/../static" + pathname;
	var fullpath=__dirname + pathname;
	fs.exists(fullpath, function(exists) {
		if(exists) {
			fs.readFile(fullpath, "binary", function(err, data) {
				if(err)
				{
					error.onSysError(500, err);
				}
				else
				{
					var mime = mimemap.getMime(pathname);
					response.writeHead(200, {"Content-type":mime});
					response.write(data, "binary");
					response.end();
					return true;
				}
			});
		} else {
			error.onError("no_file", response);
		}
	});
}

function getMap(realpath)
{
	return function(pathname, request, response) {
		return get(realpath, request, response);
	};
}

exports.get=get;
exports.getMap=getMap;
