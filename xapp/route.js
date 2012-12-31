

function route(handle, pathname, request, response) {

  if (typeof handle[pathname] === 'function') {
    handle[pathname](pathname, request, response);
    return true;
  }
  else if (typeof handle["*"] === 'function') {
    handle["*"](pathname, request, response);
    return true;
  }
  return false;
}

exports.route = route;
