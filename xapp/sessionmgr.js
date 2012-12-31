var http=require('http');
var redis=require('redis');
var util=require('util')
var parse = require('querystring').parse;

var SIDName = "xsid";
var EXPIRE_TIME = 10; // 30分钟

var privSessionDB = null;
/*
var privSessionDB = redis.createClient()
				.on("error", function()
				{
					privSessionDB = null;
				})
				.on("end", function()
				{
					privSessionDB = null;
				});
//*/
var SessionDB = new function()
{
	this.onConnectionLost = function(err)
	{
		privSessionDB = null;
		console.error("onConnectionLost, error: " + err);
	}
	this.onConnectionEnd = function()
	{
		privSessionDB = null;
		console.error("onConnectionEnd");
	}
	this.getDB = function()
	{
		if(privSessionDB == null)
		{
			try
			{
				privSessionDB = redis.createClient();
				privSessionDB.on("error", this.onConnectionLost)
				privSessionDB.on("end", this.onConnectionEnd);
			}
			catch(e)
			{
				console.error("Exception in GetDBConnection!!! -> " + e);
				privSessionDB = null;
			}
		}
		return privSessionDB;
	};
}

function sessionExists(sid, userAgent, callback)
{
	if(!callback)
		return false;
	var db = SessionDB.getDB();
	if(db == null)
	{
		callback("db is down", null)
		return false;
	}
	db.get("sk" + sid, function(err, replies)
	{
		err = (err || replies <= 0 || replies != userAgent);
		callback(err, replies);
	});
	return true;
}

function session()
{
	this.existA = false;
	this.sid = '';
	this.exists = function(callback)
	{
		sessionExists(this.sid, callback);
	};
	this.start = function(newSid, sid, userAgent)
	{
		this.sid = sid;
		if(!newSid)
		{
			return this.poke();
		}
		var db = SessionDB.getDB();
		if(db == null)
			return false;

		db.set("sk" + sid, userAgent, function(err, replies)
		{
			if(!err)
				db.expire("sk" + sid, EXPIRE_TIME);
		});
		return true;
	};
	this.stop = function()
	{
		var db = SessionDB.getDB();
		if(db == null)
			return false;
		db.del("sk" + this.sid);
		db.del(this.sid);
		return true;
	};
	this.set = function(name, value, callback)
	{
		var db = SessionDB.getDB();
		if(db == null)
		{
			if(callback)
				callback("db is down", null);
			return false;
		}
		db.hset(this.sid, name, value, function(err, replies)
		{
			if(callback)
				callback(err, replies);
		});
		this.poke();
		return true;
	};
	this.get = function(name, callback)
	{
		var db = SessionDB.getDB();
		if(db == null)
		{
			if(callback)
				callback("db is down", null);
			return false;
		}
		db.hget(this.sid, name, function(err, replies)
		{
			if(callback)
				callback(err, replies);
		});
		this.poke();
		return true;
	};
	this.poke = function()
	{
		var db = SessionDB.getDB();
		if(db == null)
			return false;
		return db.expire("sk" + this.sid, EXPIRE_TIME);
	}
}

function generateSID()
{
	var pre = 'SESSION';
	var time = new Date().getTime() + '';
    var id = pre + '_' + (time).substring(time.length - 6) + '_' + (Math.round(Math.random() * 1000));
    return id;
}

function getSIDFromCookie(cookies)
{
	cookies = parse(cookies, "; ");
	var sid="";
	for(var i in cookies)
	{
		if(i == SIDName)
		{
			sid = cookies[i];
			break;
		}
	}
	return sid;
}

exports.startSession = function(request, response, callback)
{
	var s = new session();
	var userAgent = request.headers['user-agent'];
	var sid = getSIDFromCookie(request.headers.cookie);
	if(sid == "")
	{
		sid = generateSID();
		console.log("1. generateSID: " + sid);
		s.start(true, sid, userAgent);
		response.setHeader('Set-Cookie', [SIDName + "=" + sid]);
		if(callback)
			callback(request, response, s);
	}
	else
	{
		sessionExists(sid, userAgent, function(err, replies)
		{
			if(err)
				console.log("sessionExists error: " + err);
			if(err)
			{
				sid = generateSID();
				console.log("2. generateSID: " + sid);
			}
			else
			{
				console.log("3. cookieSID: " + sid);
			}
			s.start(err, sid, userAgent);
			response.setHeader('Set-Cookie', [SIDName + "=" + sid]);
			if(callback)
				callback(request, response, s);
		});
	}
};

exports.clearSession = function()
{
	var db = SessionDB.getDB();
	if(db == null)
		return false;
	db.flushdb();
}


