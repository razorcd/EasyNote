var express = require("express");
var db = require("./config/db.js");

var serverApp = express();


//var DBurl =process.env.DATABASE_URL || "postgres://djjtbgajpsbulz:XQYa1HvDXVMswCH2-BzJ-LuDsS@ec2-54-83-196-217.compute-1.amazonaws.com:5432/d33odevsd8p14f";

db.connectDb("testUser", "test");
 // db.addNote({
 // 			title: "sdsssssssssss",
 // 			text: "sdgdxxxxxxxxxxxxxxxxxxxxxxxfg",
 // 			expire: Date.parse("2016")
 // 			},
 // 			 function(err){
 // 				if (err) console.log(err);
 // 			}
 // );

// db.getAllNotes(function(err,notes){
//  	if (err) console.log(err);
// 	console.log(notes);
// });

// db.deleteById("53737c69f39a37e03471805b", function(err,note){
// 	if (err) { console.log(err); return; }
// 	console.log("Deleted: ");
// 	console.log(note.deletedNote);
// })

// db.findByTitleSearch("a", function(err, notes){
// 	if (err) { console.log(err); return; }
// 	console.log("Found my text in title: ");
// 	console.log(notes);
// })

db.findByTitle("AAAAAAAAA", function(err, notes){
	if (err) { console.log(err); return; }
	console.log("Found by exact title: ");
	console.log(notes);
})




serverApp.configure(function() {
	serverApp.use(express.static(__dirname + "/public"));
	serverApp.use(express.logger('dev'));
	serverApp.use(express.bodyParser());
});


var port = Number(process.env.PORT || 5000);
serverApp.listen(port, function(){
	console.log("-------------------------- Listening on port: "+ port + " ----------------------------");
});