var mongoose=require("mongoose");

var noteSchema = mongoose.Schema({
		title: { type : String, default : "" },
		text : { type : String, default : "" },
		expire: { type : Date, default : 0 },
		createdDate : { type : Date, default : Date.now() },
		creatorUser : { type : String, default : "" }
		//accessUsers : { type:Array, default : [] }    // [{name: "user1", readOnly: "0"}, {name: "user2", readOnly: "1"}]
	});


module.exports = mongoose.model("Note", noteSchema);