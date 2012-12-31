var http=require('http');


function onError(err, response)
{
	if(err == "no_verb")
	{
		response.writeHead(500, {"Content-type":"text/plain"});
		response.write("500, Verb Not Supported.")
	}
	else if(err == "no_file")
	{
		response.writeHead(404, {"Content-type":"text/plain"});
		response.write("404, File Not Found.")
	}
	else if(err == "err_server")
	{
		response.writeHead(500, {"Content-type":"text/plain"});
		response.write("500, Server Internal Error.")
	}
	response.end();
}

exports.onError = onError;
