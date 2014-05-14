var express=require("express");

var serverApp = express();

serverApp.configure(function() {
	serverApp.use(express.static(__dirname + "/public"));
	serverApp.use(express.logger('dev'));
	serverApp.use(express.bodyParser());
});


var port = Number(process.env.PORT || 5000);
serverApp.listen(port, function(){
	console.log("-------------------------- Listening on port: "+ port + " ----------------------------");
});