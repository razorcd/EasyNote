//var mongoose = require("mongoose");
var db= require("../../../app/db/db-notes-func.js");
	var waitTime = 5000;

describe("backend", function() {
	describe("database", function() {

		var flag,errResult,dataResult,id;

		beforeEach(function(){
			flag=false;
			errResult = undefined;
		 	dataResult = undefined;
		})



		it("should load db.js module", function(){
			expect(db.connectDb).toBeDefined();
			expect(db.disconnectDb).toBeDefined();
		})



		it("should connect to db", function(){

			var callback = function(err){
				flag=true;
				errResult=err;
			}

			runs(function(){
				db.connectDb("testUser", "test", callback);
			});

			waitsFor(function(){
				return flag;
			}, "cb.connectDb didn't end", waitTime);

			runs(function(){
				expect(flag).toBe(true);
				expect(errResult.error).toBe(null);
			})
		})
	  


		it("should have a Database model - schema", function() {
			var dbSchema = db.NoteModel().schema.paths;
		  	expect(dbSchema.title).toBeDefined();
		  	expect(dbSchema.text).toBeDefined();
		  	expect(dbSchema.expire).toBeDefined();
		  	expect(dbSchema.createdDate).toBeDefined();
		  	expect(dbSchema.creatorUser).toBeDefined();
		  	expect(dbSchema._id).toBeDefined();
		});



		it("should validate a note", function() {
			var note = {
				title: "Some title",
				text: "some text",
				expire: Date.now(),
				creatorUser: "Razor"
			}
			expect(db.validate(note)).toBe(true);
		 	expect(db.validate()).toBe(false);
		 	expect(db.validate({})).toBe(false);
		 	note.title = "";
		 	expect(db.validate(note)).toBeFalsy();
		 	note.title = "text";
		 	note.expire = "";
		 	expect(db.validate(note)).toBeFalsy();
			note.expire = undefined;
			expect(db.validate(note)).toBeFalsy();
		});



		it("should add a note in db", function() {
		  	var note = {
				title: "Some title",
				text: "some text",
				expire: Date.now(),
				creatorUser: "Razor"
			}

			var callback = function(err){
				flag=true;
				errResult=err;
			}

			runs(function(){
				db.addNote(note,callback)
			})

			waitsFor(function(){
				return flag;
			}, "error adding Note to db", waitTime);

			runs(function(){
				expect(flag).toBe(true);
				expect(errResult.error).toBe(null);
			})
		});



		it("should find by exact title", function() {
		 	var callback = function(err, data){
		 		flag = true;
		 		errResult = err;
		 		dataResult = data;
		 	}

		 	runs(function(){
			 	db.findByTitle("Some title", callback);
		 	});

		 	waitsFor(function(){
		 		return flag;
		 	},"findByTitle didn't end", waitTime);

		 	runs(function(){
		 		expect(flag).toBe(true);
		 		expect(errResult).toBe(null);
		 		expect(dataResult.length).toBeGreaterThan(0); //the array length of dataResult should be more the 0 - means it found/returned something
		 		for (var i = 0; i < dataResult.length; i++) { //each returned node must have the correct title
		 			expect(dataResult[i].title).toBe("Some title");
		 		};
		 		expect(dataResult[0]._id).toBeDefined();
		 		id=dataResult[0]._id;
		 	})
		});



		it("should find nothing for wrong title", function() {
		  	var callback = function(err, data){
		 		flag = true;
		 		errResult = err;
		 		dataResult = data;
		 	}

		 	runs(function(){
			 	db.findByTitle("qwertyuiop753246864566", callback);
		 	});

		 	waitsFor(function(){
		 		return flag;
		 	},"findByTitle didn't end", waitTime);

		 	runs(function(){
		 		expect(flag).toBe(true);
		 		expect(errResult).not.toBe(null);
		 		expect(dataResult).toBeUndefined(); //the array of dataResult should be undefined - means it didn't find anything
		 	})
		});



		it("should find by text in titles", function() {
		 	var callback = function(err, data){
		 		flag = true;
		 		errResult = err;
		 		dataResult = data;
		 	}

		 	runs(function(){
			 	db.findByTitleSearch("title", callback);
		 	});

		 	waitsFor(function(){
		 		return flag;
		 	},"findByTitleSearch didn't end", waitTime);

		 	runs(function(){
		 		expect(flag).toBe(true);
		 		expect(errResult).toBe(null);
		 		expect(dataResult.length).toBeGreaterThan(0); //the array length of dataResult should be more the 0 - means it found/returned something
		 		for (var i = 0; i < dataResult.length; i++) { //each returned node must have the correct title
		 			expect(dataResult[i].title.search("title")).toBeGreaterThan(-1);
		 		};
		 		expect(dataResult[0]._id).toBeDefined();
		 	})
		});



		it("should return error if findByTitleSearch can't find any title that includes the titleText", function() {
		  var callback = function(err, data){
		 		flag = true;
		 		errResult = err;
		 		dataResult = data;
		 	}

		 	runs(function(){
			 	db.findByTitleSearch("IUNOIUHN&II*&NP*OUJP*UP*OY10", callback);
		 	});

		 	waitsFor(function(){
		 		return flag;
		 	},"findByTitleSearch didn't end", waitTime);

		 	runs(function(){
		 		expect(flag).toBe(true);
		 		expect(errResult).toBeDefined();
		 		expect(errResult).not.toBe(null);
		 		expect(dataResult).toBeUndefined(0); //the array length of dataResult should be more the 0 - means it found/returned something
		 	})
		});




		it("should get all notes", function() {
		 	var callback = function(err, data){
		 		flag = true;
		 		errResult = err;
		 		dataResult = data;
		 	}

		 	runs(function(){
			 	db.getAllNotes(callback);
		 	});

		 	waitsFor(function(){
		 		return flag;
		 	},"getAllNotes didn't end", waitTime);

		 	runs(function(){
		 		expect(flag).toBe(true);
		 		expect(errResult).toBe(null);
		 		expect(dataResult.length).toBeGreaterThan(0); //the array length of dataResult should be more the 0 - means it found/returned something
		 		
		 		expect(dataResult[0]._id).toBeDefined();
		 	})
		});



		it("should get all notes for user: Razor", function() {
		 	var callback = function(err, data){
		 		flag = true;
		 		errResult = err;
		 		dataResult = data;
		 	}

		 	runs(function(){
			 	db.getUserNotes("Razor", callback);
		 	});

		 	waitsFor(function(){
		 		return flag;
		 	},"getUserNotes didn't end", waitTime);

		 	runs(function(){
		 		expect(flag).toBe(true);
		 		expect(errResult).toBe(null);
		 		expect(dataResult.length).toBeGreaterThan(0); //the array length of dataResult should be more the 0 - means it found/returned something
		 		for (var i = 0; i < dataResult.length; i++) {
		 			expect(dataResult[i].creatorUser).toBe("Razor");
		 		};
		 		
		 	})
		});



		it("should find nothing for a non existent user", function() {
			var callback = function(err,data){
				flag=true;
				errResult=err;
				dataResult=data;
			}
		  
		  	runs(function(){
		  		db.getUserNotes("qwueyrpwoeyr934879384uro8weu",callback);
		  	});

		  	waitsFor(function(){
		  		return flag;
		  	}, "getUserNotes didn't end", waitTime);


		  	runs(function(){
		  		expect(flag).toBe(true);
		  		expect(errResult.error).not.toBe(null);
		  		expect(dataResult).toBeUndefined();
		  	})

		});



		it("should get note with specified ID", function() {
			//var i=0;
		 	var callback = function(err, data){
		 		flag = true;
		 		errResult = err;
		 		dataResult = data;
		 	}

		 	runs(function(){
			 	db.findByTheId(id, callback);
		 	});

		 	waitsFor(function(){
		 		//console.log(i++);
		 		return flag;
		 	},"findByTheId didn't end", waitTime);

		 	runs(function(){
		 		 expect(flag).toBe(true);
		 		 expect(errResult).toBe(null);
		 		 expect(dataResult).toBeDefined(); 
		 		 expect(dataResult._id).toEqual(id);
		 	})
		});



		it("should update a node with specified ID", function() {
			var note = {
				title: "Some title",
				text: "some text updated",
				expire: Date.now(),
				creatorUser: "Razor"
			}

		 	var callback = function(err, data){
		 		flag = true;
		 		errResult = err;
		 		dataResult = data;
		 	}

		 	runs(function(){
			 	db.updateById(id, note, callback);
		 	});

		 	waitsFor(function(){
		 		if(flag) {
		 			flag=true;
		 			//db.get
		 			return flag;
		 		}
		 		return false;
		 	},"updateById didn't end", waitTime);

		 	runs(function(){
		 		expect(flag).toBe(true);
		 		expect(errResult).toBe(null);
		 	})
		});



		it("should check that previews test really changed text for note with specified ID.", function() {
			var callback = function(err, data){
		 		flag = true;
		 		errResult = err;
		 		dataResult = data;
		 	}

		  	runs(function(){
		 		db.findByTheId(id,callback);
		 	});

		 	waitsFor(function(){
		 		return flag;
		 	})

		 	runs(function(){
		 		expect(flag).toBe(true);
		 		expect(dataResult).toBeDefined();
		 		expect(dataResult.text).toBe("some text updated")
		 	})

		});



		it("should delete a note by ID", function() {
			var callback = function(err,data){
				flag=true;
				errResult=err;
				dataResult=data;
			}
		  
		  	runs(function(){
		  		db.deleteById(id,callback);
		  	});

		  	waitsFor(function(){
		  		return flag;
		  	}, "deleteById didn't end", waitTime);

		  	runs(function(){
		  		expect(flag).toBe(true);
		  		expect(errResult).toBe(null);
		  		expect(dataResult.deletedNote).toBeDefined();
		  		expect(dataResult.deletedNote._id).toEqual(id);
		  	})
		});



		it("should return an error object if deleteById can't find the ID (using same ID we deleted one test above)", function() {
			var callback = function(err,data){
				flag=true;
				errResult=err;
				dataResult=data;
			}
		  
		  	runs(function(){
		  		db.deleteById(id,callback);
		  	});

		  	waitsFor(function(){
		  		return flag;
		  	}, "deleteById didn't end", waitTime);

		  	runs(function(){
		  		expect(flag).toBe(true);
		  		expect(errResult).toBeDefined();
		  		expect(dataResult).toBeUndefined();
		  	})
		});



		it("should disconnect from db", function(){

			var callback = function(err){
				flag=true;
				errResult=err;
			}

			runs(function(){
				db.disconnectDb(callback);
			});

			waitsFor(function(){
				return flag;
			}, "cb.disconnectDb didn't end", waitTime);

			runs(function(){
				expect(flag).toBe(true);
				expect(errResult.error).toBe(null);
			})
		})


	});


  
});