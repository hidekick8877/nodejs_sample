var http = require("http");
var url = require("url");
var fs = require('fs');
var querystring = require("querystring");
var mysql = require('mysql');


/*
	server request callback function
*/
var request = function(req, res) {
	
	// parse Url
	var parsedUrl = url.parse("http://" + setting.IP + ":" + setting.PORT + req.url);
	
	// top page
	if ("/" === parsedUrl.pathname)
	{
		// response header 
		res.writeHead(200);
		// response contents
		res.write("Welcome to Top Page!")
		// finish request
		res.end();
	}
	// read file test
	else if ("/file" === parsedUrl.pathname)
	{	
		fs.readFile('./file.html', function(err, content)
		{
			if (err)
			{
				console.log('file err:', err);
				res.writeHead("500");
				res.end();
			}
			else
			{
				res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
				res.end(content);
			}
		});
	}
	// method test
	else if ("/method" === parsedUrl.pathname)
	{
		if ("GET" === req.method)
		{
			// response header 
			res.writeHead(200);
			// response contents
			res.write("HTTP Method is GET")
			// finish request
			res.end();
		}
		else if("POST" === req.method)
		{
			req.data = "";
			req.on("readable", function () {
				req.data += req.read();
			});
			
			req.on("end", function () {
				// parse request data
				var query = querystring.parse(req.data);
	
				// show result
				res.writeHead(200);
				res.write("Your post data [" + req.data + "]\n");
				for (key in query) {
					res.write("Your post data  [" + key  + "] => [" + query[key] +"]\n");
				}
				res.end();
			});		
		}
	}
	// mysql test 
	else if ("/mysql" === parsedUrl.pathname)
	{
		// mysql connection obj
		var mysql_conn = mysql.createConnection({
			host	 : 'localhost', 	// hostname
			user	 : 'root',	  	// user name
			password : '',  			// password
			database : 'test01'		// DB name
		});
		/*
		mysql> desc test;
		+-------+----------------+-------+------+----------+-------+
		| Field | Type		| Null | Key | Default | Extra |
		+-------+----------------+-------+------+----------+-------+
		| id	| int(11)	 | YES  |	 | NULL	|	   |
		| name  | varchar(64) | YES  |	 | NULL	|	   |
		+-------+----------------+-------+------+----------+-------+
		*/

		var query = querystring.parse(parsedUrl.query);
		console.log('query.id:' + query.id);
		if (query.id === undefined)
		{
			res.writeHead("404");
			res.end();
			return;
		}
		
		var sql = "SELECT * from test where id = ?";
		mysql_conn.query(sql, [query.id], function(err, results)
		{
			if(err)
			{
				console.log('mysql err:', err);
				res.writeHead("500");
			}
			else
			{
				// success sql 
				console.log('results len(' +  results.length + ')');
				if (results.length == 1)
				{
					var json_string = JSON.stringify(results[0]);
					console.log('results[0]: ', results[0]);
					res.writeHead("200");
					res.write(json_string);
				}
				else
				{
					res.writeHead("404");
				}
			}
			mysql_conn.destroy();
			res.end();
		});
	}
	// Not found
	else
	{
		res.writeHead("404");
		res.end();
	}
}



// read config info. Listen Addr, Listen Port
try {
	var path = require.resolve("./param.js");
	var setting = require(path);
}
catch (e) {
	// faild set default value
	var setting = {
		"IP": "0.0.0.0",
		"PORT": 1500
	}
}

// create server obj
var server = http.createServer();
// set request event
server.on("request", request);
// start server listen
server.listen(setting.PORT, setting.IP, setting.startServer);

















/* url.parseを使用すると以下のようなデータが帰ってくる
	{
	protocol: 'http:',
	slas	hes: true,
	host: '192.168.1.202:1337',
	port: '1337',
	hostname: '192.168.1.202',
	href: 'http://192.168.1.202:1337/foo/test?bar=value',
	search: '?bar=value',
	query: 'bar=value',
	pathname: '/foo/test',
	path: '/foo/test?bar=value'
	}
	url.parse(req.url); と記述しても良い
	url.parse(req.url, true); と記述するとqueryがオブジェクトになるので使いやすい
	*/
