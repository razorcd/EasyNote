var express = require("express");
var app = express();
var mongoose = require("mongoose");
var db = require("./config/db.js")

db.connectDb("testUser", "test");

var port = process.env.PORT || 8080;


app.configure(function(){
	app.use(express.static(__dirname + "/public"));
	app.use(express.logger("dev"));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
});


console.log("-------------------------SERVER LISTENING ON PORT: " + port + "--------------------");
app.listen(port);