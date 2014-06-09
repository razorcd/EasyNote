var express = require("express");
var app = express();

var db = require("./app/db/db-notes-func.js");


db.connectDb("testUser", "test", function(info){
	if(info.error !== null) console.error("Error connectng DB");
});


app.configure(function(){
	app.use(express.static(__dirname + "/public"));
	app.use(express.logger("dev"));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ secret: 'notesecretsession22' }));
})


var routes = require("./app/routes/notes-func-routes.js");
routes.setRoutes(app);
var loginRoutes = require("./app/routes/user-loginout-routes.js")(app);


var port = process.env.PORT || 5000;

console.log("-------------------------SERVER LISTENING ON PORT: " + port + "--------------------");
app.listen(port);