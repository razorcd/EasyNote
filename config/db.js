var mongoose = require('mongoose');

var dbSchema = new mongoose.Schema({
		title: { type : String, default : "" },
		text : { type : String, default : "" },
		expire: { type : Date, default : 0 },
		created : { type : Date, default : Date.now() }
	});

var NoteModel = mongoose.model("Note", dbSchema);

//connect to DB
exports.connectDb = function(user, pass){
	//console.log(user,pass);
	var DBurl = "mongodb://" + user + ":" + pass + "@ds033267.mongolab.com:33267/easynotes";
	
	mongoose.connect(DBurl);

	// var Cat = mongoose.model('Cat', {name:String});
	// var kitty = new Cat({name:'ZZZZ'});
	// kitty.save(function(err){
	// 	if (err) console.log(err);
	// 	console.log("DONE");
	// });

}

exports.addNote = function(note,cb){
	var newNote = new NoteModel(note);

	newNote.save(function(err){
		if (err) { cb(err);	return;	}
		cb(null);
	})

}



exports.getAllNotes = function(cb){
	var querry = NoteModel.find();

	querry.exec(function(err, notes){
		if (err) { cb(err); return; }
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
			cb(null);
		})

	//})

}