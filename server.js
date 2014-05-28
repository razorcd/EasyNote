var express = require("express");
var app = express();
var mongoose = require("mongoose");
var db = require("./config/db.js");
var routes = require("./app/routes.js");


routes.setRoutes(app);

db.connectDb("testUser", "test", function(info){
	if(info.error !== null) console.error("Error connectng DB");
});

var port = process.env.PORT || 5000;


/*app.configure(function(){ 
	app.use(express.static(__dirname + "/public"));
	app.use(express.logger("dev"));
	app.use(express.bodyParser());
	//app.use(express.methodOverride());
});*/


console.log("-------------------------SERVER LISTENING ON PORT: " + port + "--------------------");
app.listen(port);