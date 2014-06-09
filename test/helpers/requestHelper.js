//MAKING HTTP REQUESTS WITH NODE

var http = require("http");

exports.request = function(hostname,port,path,method,cookie,data,cb ){   //cb(err,resData, res);
	if (typeof data === "object") data=JSON.stringify(data);
	var resData = "";
	var options = {
		hostname:hostname,
		port:port,
		path:path,
		method:method,
		headers: {
			'Cookie': cookie,
          	'Content-Type': 'application/json',
      	}
	}
	

	var req = http.request(options, function(res){
		//res.statusCode
		//res.headers
		res.setEncoding("utf8");

		res.on("data", function(chunk){
			resData += chunk;
		});

		res.on("end", function(){
			cb(null,resData,res);
		});

	});

	req.on("error", function(e){
		cb(e);
	});
	
	if (!(data===undefined || data==="")) { req.write(data); }
	req.end();
}