var mongoose = require('mongoose');

var dbSchema = new mongoose.Schema({
		title: { type : String, default : "" },
		text : { type : String, default : "" },
		expire: { type : Date, default : 0 },
		createdDate : { type : Date, default : Date.now() },
		creatorUser : { type : String, default : "" }
		//accessUsers : { type:Array, default : [] }    // [{name: "user1", readOnly: "0"}, {name: "user2", readOnly: "1"}]
	});

var NoteModel = mongoose.model("Note", dbSchema);

//connect to DB
exports.connectDb = function(user, pass){
		var DBurl = "mongodb://" + user + ":" + pass + "@ds033267.mongolab.com:33267/easynotes";
		mongoose.connect(DBurl, function(err){
			if (err) { console.log(err); return; }
			console.log("Db: Connected");
		});
	
}

//add 1 note
exports.addNote = function(note,cb){
	var newNote = new NoteModel(note);

	newNote.save(function(err){
		if (err) { cb(err);	return;	}
		console.log(" DB: Note added to db")
		cb(null);
	})

}


//get list of all notes
exports.getAllNotes = function(cb){
	exports.connectDb("testUser", "test");
	var querry = NoteModel.find();

	querry.exec(function(err, notes){
		if (err) { cb(err); return; }
		console.log(" DB: Received all notes from db")
		cb(null, notes);
	})
}


//get list of all notes for specified User
exports.getUserNotes = function(user,cb){
	var querry = NoteModel.find({creatorUser: user});

	querry.exec(function(err, notes){
		if (err) { cb(err); return; }
		console.log(" DB: Received all notes for user: " + user)
		cb(null, notes);
	})
}

exports.deleteById= function(id, cb){
	NoteModel.findById(id, function(err, note){
		if (err) { cb(err); return; }
		if(note) {
			foundNote = new NoteModel(note);
			foundNote.remove(function(err, deletedNote){
				if (err) { cb(err); return; }
				console.log(" DB: Deleted note with ID: " + id);
				cb(null, {deletedNote : deletedNote});
			})
		} else cb({error: "can't find ID"});
	})
}


//searches titeText in all Ttitles
exports.findByTitleSearch = function(titleText, cb){
	var titleRegExp = new RegExp(titleText,"i");

	var querry = NoteModel.find({title: titleRegExp});

	querry.exec(function(err,notes){
		if (err ) { cb(err); return; }
		if (notes.length < 1) { cb({error: "Can't find TEXT in TITLES"}); return; }
		console.log(" DB: Received all notes that match title text: "+ titleText)
		cb(null, notes);
	})

}


//searches exact Title
exports.findByTitle = function(title, cb){
	var titleRegExp = new RegExp("^(\\s*)(" + title + ")(\\s*)$","i");

	var querry = NoteModel.find({title: titleRegExp});

	querry.exec(function(err,notes){
		if (err ) { cb(err); return; }
		if (notes.length < 1) { cb({error: "Can't find TITLE"}); return; }
		console.log(" DB: Received all notes with title: " + title);
		cb(null, notes);
	})

}


//update by ID
exports.updateById = function(id, newNote, cb){
	//NoteModel.findById(id, function(err, foundNote){
		var querry = {_id : id};
		NoteModel.update(querry, newNote, function(err, nrUpNotes){
			if (err ) { cb(err); return; }
			if (nrUpNotes < 1 ) { cb({error : "Can't find ID. No notes were updated"}); return; }
			console.log(" DB: Updated note with id: " + id)
			cb(null);
		})

	//})

}

//deletes all notes
//exports.deleteAll();
exports.deleteAll = function(){
	var querry = NoteModel.find();

	querry.exec(function(err, notes){
		if (err) { console.log("error deleting all"); return; }

		for (var i=0, len=notes.length; i<len; i++){
			var tempNote = notes[i];
			console.log(" DB: DELETING ALL");
			tempNote.remove();
		}
	})
}

