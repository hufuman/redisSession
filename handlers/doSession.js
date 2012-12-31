
var error=require("../xapp/error");
var sys=require("sys");
var fs=require("fs");
var sessionmgr=require("../xapp/sessionmgr");
var formidable=require("formidable");



function getsession(request, response, session)
{
	session.get(request.query.ssName, function(err, replies)
	{
		if(err)
		{
			response.writeHead(500, {"Content-type":"text/plain"});
			response.write('{"status" : "error"}');
		}
		else
		{
			response.writeHead(200, {"Content-type":"text/plain"});
			response.write('{"status" : "ok", "value" : "' + replies + '"}');
		}
		response.end();
	});
}

function setsession(request, response, session)
{
    var query = request.query;
    session.set(query.ssName, query.ssValue, function(err, replies)
    {
    	if(err)
	   	{
			response.writeHead(500, {"Content-type":"text/plain"});
			response.write('{"status" : "error"}');
	   	}
	   	else
	   	{
			response.writeHead(200, {"Content-type":"text/plain"});
			response.write('{"status" : "ok"}');
	   	}
		response.end();
	});
}

function DoGetSession(pathname, request, response)
{
	var form = new formidable.IncomingForm();
	form.parse(request, function(err, fields, files)
	{
		if(err)
		{
			error.onError("err_server", response);
		}
		else
		{
			request.query = fields;
			sessionmgr.startSession(request, response, getsession);
		}
	});
    return true;
}

function DoSetSession(pathname, request, response)
{
	var form = new formidable.IncomingForm();
	form.parse(request, function(err, fields, files)
	{
		if(err)
		{
			error.onError("err_server", response);
		}
		else
		{
			request.query = fields;
			sessionmgr.startSession(request, response, setsession);
		}
	});
    return true;
}

exports.getsession = DoGetSession;
exports.setsession = DoSetSession;
