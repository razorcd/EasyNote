var mongoose=require("mongoose");
var NoteModel = require("../models/notes.js");

exports.NoteModel = function(){
	return NoteModel;
}

//connect to DB
exports.connectDb = function(user, pass, cb){
		var DBurl = "mongodb://" + user + ":" + pass + "@ds033267.mongolab.com:33267/easynotes";
		mongoose.connect(DBurl, { server:{w:1}}, function(err){
			if (err) {
				console.log("Db Connection error");	
				cb({error:500, message:"Error connecting to db", data:err});
				return
			}
			console.log("Db Connected");
			cb({error:null, message:"Db connected",data:null});
		});
}

exports.disconnectDb = function(cb){
	mongoose.disconnect(function(err){
		if(err) { 
			cb({error:500, message:"Error disconnecting db", data:err});
			return;
		}
		console.log("Db Disonnected");
		cb({error:null, message:"Db disconnected", data:null});
	})
}


//add 1 note
exports.addNote = function(note,cb){
	if (!validate(note)) {
		cb({error:500, message:"error: Note object not valid", data:err});	
		return
	}

	var newNote = new NoteModel(note);

	newNote.save(function(err){
		if (err) { 
			cb({error:500, message:"error adding new note to db", data:err});	
			return;	
		}
		console.log(" DB: Note added to db")
		cb({error:null, message:"Note added to db", data:null});
	})

}



var validate = function(note){
	if (!note) return false;
	if (typeof note !== "object") return false;
	if (!(note.title && typeof note.title === "string" )) return false;
	if (!(note.text && typeof note.text === "string" )) return false;
	if (!(note.expire && typeof note.expire === "number" )) return false;
	if (!(note.creatorUser && typeof note.creatorUser === "string" )) return false;

	return true;
}

exports.validate = validate;


//searches by ID
exports.findByTheId = function(id, cb){
	NoteModel.findById(id,function(err,note){
		if (err ) { 
			cb({error:500, message:"error finding by id", data:err}); 
			return; 
		}
		if (!note) {
			cb({error:500, message:"error finding by id returned undefined note", data:err}); 
			return;
		}
		console.log("DB: Found the node with ID:" + id);
		cb(null, note);
		return note;
	})
}


//searches exact Title
exports.findByTitle = function(title, cb){
	var titleRegExp = new RegExp("^(\\s*)(" + title + ")(\\s*)$","i"); // creting regex to include title with spaces

	var querry = NoteModel.find({title: titleRegExp});

	querry.exec(function(err,notes){
		if (err ) { 
			cb({error:500, message:"error finding by title", data:err}); 
			return; 
		}
		if (notes.length < 1) { 
			cb({error:500, message:"Can't find note with specified title", data:null}); 
			return; 
		}
		console.log(" DB: Received all notes with title: " + title);
		cb(null, notes);
		return notes;
	})
}


//searches titeText in all Ttitles
exports.findByTitleSearch = function(titleText, cb){
	var titleRegExp = new RegExp(titleText,"i");

	var querry = NoteModel.find({title: titleRegExp});

	querry.exec(function(err,notes){
		if (err ) { 
			cb({error:500, message:"error finding by titleText", data:err}); 
			return; 
		}
		if (notes.length < 1) {
			cb({error:500, message:"error can't find text in titles", data:err}); 
			return; 
		}
		console.log(" DB: Received all notes that match title text: "+ titleText)
		cb(null, notes);
	})

}

//get list of all notes
exports.getAllNotes = function(cb){
	var querry = NoteModel.find();

	querry.exec(function(err, notes){
		if (err) { 
			cb({error:500, message:"error getting all notes", data:err}); 
			return; 
		}
		console.log(" DB: Received all notes from db");
		cb(null, notes);
		return notes;
	})
}


//get list of all notes for specified User
exports.getUserNotes = function(user,cb){
	var querry = NoteModel.find({creatorUser: user});

	querry.exec(function(err, notes){
		if (err) { 
			cb({error:500, message:"error getting all notes for user: " + user, data:err}); 
			return; 
		}
		if ((!notes) || (notes && notes.length === 0)) { 
			cb({error:500, message:"error getting all notes for user: " + user, data:err}); 
			return; 
		}
		console.log(" DB: Received all notes for user: " + user)
		cb(null, notes);
		return notes;
	})
}


//update by ID
exports.updateById = function(id, newNote, cb){
	//NoteModel.findById(id, function(err, foundNote){
		var querry = {_id : id};
		NoteModel.update(querry, newNote, function(err, nrUpNotes){
			if (err ) { 
				cb({error:500, message:"error updating node ", data:err}); 
				return; 
			}
			if (nrUpNotes < 1 ) { 
				cb({error:500, message:"error updating node ", data:err}); 
				return; 
			}
			console.log(" DB: Updated note with id: " + id)
			cb(null);
		})
}


//delete a note by it's ID
exports.deleteById= function(id, cb){
	NoteModel.findById(id, function(err, note){
		if (err) { 
			cb({error:500, message:"error finding note that will be deleted. id: " + id, data:err});
			return; 
		}
		if(note) {
			foundNote = new NoteModel(note);
			foundNote.remove(function(err, deletedNote){
				if (err) { 
					cb({error:500, message:"error deleting note with id: " + id, data:err});
					return; }
				console.log(" DB: Deleted note with ID: " + id);
				cb(null, {deletedNote : deletedNote});
			})
		} else cb({error:500, message:"error finding note that will be deleted. id: " + id, data:err});
	})
}