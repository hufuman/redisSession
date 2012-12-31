

var server = require("./xapp/server");
var fileutil = require("./xapp/fileutil");

var doSession = require("./handlers/doSession");
var sessionMgr = require("./xapp/sessionmgr");

var post_handler = {}
post_handler["/getsession.do"] = doSession.getsession;
post_handler["/setsession.do"] = doSession.setsession;

var get_handler = {}
get_handler["/"] = fileutil.getMap("index.html");
get_handler["*"] = fileutil.get;

sessionMgr.clearSession();

server.start(post_handler, get_handler);
