
var url = require("url");
var http = require("http");

var error=require("./error");
var route=require("./route");
var fileutil = require("./fileutil");

function start(post_handler, get_handler) {

  function onRequest(request, response) {

    // request.setEncoding("utf8");

    var method = request.method.toLowerCase();
    var pathname = url.parse(request.url).pathname;
    console.log("Request received: " + pathname + ", method: " + method);

    var handled = false;
    if(method == "post")
    {
      handled = route.route(post_handler, pathname, request, response);
    }
    else if(method == "get")
    {
      handled = route.route(get_handler, pathname, request, response);
    }
    else
    {
      error.onError("no_verb", response);
    }
    if(!handled)
    {
      error.onError("no_file", response);
    }
  }

  var port = 8124;
  http.createServer(onRequest).listen(port);
  console.log("Server has started on port: " + port);
}

exports.start = start;