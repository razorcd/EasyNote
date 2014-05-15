var express=require("express");
var db = require("./../config/db.js")


exports.sendError = function(val,message , req,res){
		res.writeHead(val, {"Content-Type":"application/json"});
		res.end(JSON.stringify({error: message }));
}

exports.sendSuccess = function(val,data , req,res){
		res.writeHead(val, {"Content-Type":"application/json"});
		res.end(JSON.stringify({error: null , data: data}));
}


 exports.setRoutes = function(serverApp){
	
 	serverApp.configure(function(){
 		serverApp.use(express.static(__dirname + "./../public"));
 		serverApp.use(express.logger("dev"));
 		serverApp.use(express.bodyParser());
 	})



	serverApp.post("/addnote",function(req,res){
		var currentUser = "User1";
		
		//exports.sendError(404, "File Not Found", req, res);
		var newNote = {
			title: req.body.title,
			text: req.body.text,
			expire: req.body.expire,
			creatorUser: currentUser
		}
		console.log(newNote);
		//TODO: VALIDATE

		db.addNote(newNote, function(err){
			if(err) {
				console.error(err);
				exports.sendError(500, "DB error", req, res);
				return;
			}
			exports.sendSuccess(200, "Note added", req, res);
		})
	});

	serverApp.get("/getallnotes", function(req,res){
		db.getAllNotes(function(err,notes){
			if (err) { 
				cb(err); 
				exports.sendError(500, "Error reading DB.", req, res);
				return; 
			}

			exports.sendSuccess(200, notes, req,res);
		})
	})

	serverApp.get("/getusernotes", function(req,res){
		db.getUserNotes("User1", function(err,notes){
			if (err) { 
				cb(err); 
				exports.sendError(500, "Error reading DB.", req, res);
				return; 
			}

			exports.sendSuccess(200, notes, req,res);
		})
	})

	serverApp.get("/findbytitlesearch", function(req,res){
		var titleText = req.query.titletext;
		if(!titleText || titleText == "") {
			exports.sendError(500, "Title text is empty.", req, res);
			return;
		}
		db.findByTitleSearch(titleText, function(err,notes){
			if (err) { 
				console.log(err);
				exports.sendError(500, err, req, res);
				return; 
			}

			exports.sendSuccess(200, notes, req,res);
		})
	})

	serverApp.get("/findbytitle", function(req,res){
		var title = req.query.title;
		if(!title || title == "") {
			exports.sendError(500, "Title text is empty.", req, res);
			return;
		}
		db.findByTitle(title, function(err,notes){
			if (err) { 
				exports.sendError(500, err, req, res);
				return; 
			}

			exports.sendSuccess(200, notes, req,res);
		})
	})

	serverApp.post("/updatebyid", function(req,res){
		//TODO : check currentuser = requested;
		
		var id = req.body.id;

		if(!id || id == "") {
			exports.sendError(500, "Id field is empty.", req, res);
			return;
		}

		var newNote = {
			title: req.body.title,
			text: req.body.text,
			expire: req.body.expire,
		}

		db.updateById(id, newNote, function(err){
			if (err) {
				console.log(err);
				exports.sendError(500, err, req, res);
				return;
			}
			exports.sendSuccess(200, "Upadated", req,res);
		})
	})

	serverApp.delete("/deletebyid", function(req,res){
		var id = req.query.id;

		if(!id || id == "") {
			exports.sendError(500, "Id field is empty.", req, res);
			return;
		}

		db.deleteById(id, function(err){
			if (err) {
				exports.sendError(500, err, req,res);
				return;
			}
			exports.sendSuccess(200, "Note deleted", req, res);
		})
	})


	serverApp.get("*",function(req,res){
		exports.sendError(404, "File Not Found", req, res);
	});

}


