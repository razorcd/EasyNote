var requestHelper = require("../helpers/requestHelper.js")
var server = {
	hostname:"localhost",
	port:5000
}

describe("backend", function() {
	describe("express routes", function() {
		var id;

		it("should add a note", function(done) {
			var note = {
				title:"Testing routes",
				text:"This was a test",
				expire:Date.now()
			};

			requestHelper.request(server.hostname, server.port, "/addnote", "POST", note, function(err,resData,res){
				expect(res.statusCode).toBe(200);
				done();
			});
		});


		it("should fail adding a note(string)", function(done) {
		  var note="test string addnote";
		  requestHelper.request(server.hostname, server.port, "/addnote", "POST", note, function(err, resData, res){
		  	expect(res.statusCode).not.toBe(200);
		  	done();
		  })
		});


		it("should fail adding a note(object with missing field)", function(done) {
		  var note=	{
				text:"This was a test",
				expire:Date.now()
			};
		  requestHelper.request(server.hostname, server.port, "/addnote", "POST", note, function(err, resData, res){
		  	expect(res.statusCode).not.toBe(200);
		  	done();
		  })
		});


		it("should get all notes", function(done){
			requestHelper.request(server.hostname, server.port, "/getallnotes", "GET", "", function(err,resData,res){
				expect(res.statusCode).toBe(200);
				expect(res.headers).toBeDefined();
				expect(typeof resData).toBe("string");
				expect(resData[0]).toBe("{");	expect(resData[resData.length-1]).toBe("}");
				var parsed_resData = JSON.parse(resData);
				expect(typeof parsed_resData).toBe("object");

				expect(parsed_resData.error).toBe(null);
				expect(Array.isArray(parsed_resData.data)).toBe(true);
				for (var i = 0; i < parsed_resData.data.length; i++) {
					expect(typeof parsed_resData.data[i]).toBe("object");
					expect(typeof parsed_resData.data[i].title).toBe("string");
				};
				done();
			});
		});


		it("should get user notes", function(done){
			requestHelper.request(server.hostname, server.port, "/getusernotes", "GET", "", function(err,resData,res){
				expect(res.statusCode).toBe(200);
				expect(res.headers).toBeDefined();
				expect(typeof resData).toBe("string");
				expect(resData[0]).toBe("{");	expect(resData[resData.length-1]).toBe("}");
				var parsed_resData = JSON.parse(resData);
				expect(typeof parsed_resData).toBe("object");

				expect(parsed_resData.error).toBe(null);
				expect(Array.isArray(parsed_resData.data)).toBe(true);
				for (var i = 0; i < parsed_resData.data.length; i++) {
					expect(typeof parsed_resData.data[i]).toBe("object");
					expect(typeof parsed_resData.data[i].title).toBe("string");
				};
				done();
			});
		});


		it("should find by text in title", function(done){
			requestHelper.request(server.hostname, server.port, "/findbytitlesearch?titletext=Testing", "GET", "", function(err,resData,res){
				expect(res.statusCode).toBe(200);
				expect(res.headers).toBeDefined();
				expect(typeof resData).toBe("string");
				expect(resData[0]).toBe("{");	expect(resData[resData.length-1]).toBe("}");
				var parsed_resData = JSON.parse(resData);
				expect(typeof parsed_resData).toBe("object");

				expect(parsed_resData.error).toBe(null);
				expect(Array.isArray(parsed_resData.data)).toBe(true);
				for (var i = 0; i < parsed_resData.data.length; i++) {
					expect(typeof parsed_resData.data[i]).toBe("object");
					expect(typeof parsed_resData.data[i].title).toBe("string");
				};
				done();
			});
		});


		it("should return error if can't find by text in title", function(done){
			requestHelper.request(server.hostname, server.port, "/findbytitlesearch?titletext=EFRVJHJU^T$E#DFGU**UH", "GET", "", function(err,resData,res){
				expect(res.statusCode).not.toBe(200);
				expect(res.headers).toBeDefined();
				expect(typeof resData).toBe("string");
				expect(resData[0]).toBe("{");	expect(resData[resData.length-1]).toBe("}");
				var parsed_resData = JSON.parse(resData);
				expect(typeof parsed_resData).toBe("object");

				expect(typeof parsed_resData.error).toBe("object");
				expect(parsed_resData.error.error).toBe(500);
				expect(parsed_resData.error.data).toBe(null);
				done();
			});
		});


		it("should find by exact title", function(done){
			requestHelper.request(server.hostname, server.port, "/findbytitlesearch?titletext=Testing%20routes", "GET", "", function(err,resData,res){
				expect(res.statusCode).toBe(200);
				expect(res.headers).toBeDefined();
				expect(typeof resData).toBe("string");
				expect(resData[0]).toBe("{");	expect(resData[resData.length-1]).toBe("}");
				var parsed_resData = JSON.parse(resData);
				expect(typeof parsed_resData).toBe("object");

				expect(parsed_resData.error).toBe(null);
				expect(Array.isArray(parsed_resData.data)).toBe(true);
				for (var i = 0; i < parsed_resData.data.length; i++) {
					expect(typeof parsed_resData.data[i]).toBe("object");
					expect(typeof parsed_resData.data[i].title).toBe("string");
				};
				expect(typeof parsed_resData.data[0]._id).toBe("string");
				id=parsed_resData.data[0]._id;
				done();
			});
		});


		it("should return error if can't find by exact title", function(done){
			requestHelper.request(server.hostname, server.port, "/findbytitlesearch?titletext=XO*UOM*UJJe9vtem9rv1", "GET", "", function(err,resData,res){
				expect(res.statusCode).not.toBe(200);
				expect(res.headers).toBeDefined();
				expect(typeof resData).toBe("string");
				expect(resData[0]).toBe("{");	expect(resData[resData.length-1]).toBe("}");
				var parsed_resData = JSON.parse(resData);
				expect(typeof parsed_resData).toBe("object");

				expect(typeof parsed_resData.error).toBe("object");
				expect(parsed_resData.error.error).toBe(500);
				expect(parsed_resData.error.data).toBe(null);
				done();
			});
		});



		it("should update by ID", function(done){
			var note = {
				id:id,
				title: "Test update title",
				text: "Testing UPDATED text",
				expire: Date.now()
			}
			requestHelper.request(server.hostname, server.port, "/updatebyid", "POST", note, function(err,resData,res){
				expect(res.statusCode).toBe(200);
				expect(res.headers).toBeDefined();
				expect(typeof resData).toBe("string");
				var parsed_resData = JSON.parse(resData);
				expect(typeof parsed_resData).toBe("object");

				expect(parsed_resData.error).toBe(null);
				expect(parsed_resData.data).toBe("Updated");
				done();
			});
		});


		it("should return error if can't update by ID(wrong ID)", function(done){
			var note = {
				id:"7reto8ernvo8ugvn8dunf8suXXXX",
				title: "Test update title",
				text: "Testing UPDATED text",
				expire: Date.now()
			}
			requestHelper.request(server.hostname, server.port, "/updatebyid", "POST", note, function(err,resData,res){
				expect(res.statusCode).not.toBe(200);
				expect(res.headers).toBeDefined();
				expect(typeof resData).toBe("string");
				var parsed_resData = JSON.parse(resData);
				expect(typeof parsed_resData).toBe("object");

				done();
			});
		});


		it("should return error if can't update by ID(missing note field)", function(done){
			var note = {
				id:id,
				text: "Testing UPDATED text",
				expire: Date.now()
			}
			requestHelper.request(server.hostname, server.port, "/updatebyid", "POST", note, function(err,resData,res){
				expect(res.statusCode).not.toBe(200);
				expect(res.headers).toBeDefined();
				expect(typeof resData).toBe("string");
				var parsed_resData = JSON.parse(resData);
				expect(typeof parsed_resData).toBe("object");

				done();
			});
		});


		it("should find by ID", function(done){

			requestHelper.request(server.hostname, server.port, "/findbyid?id="+id, "GET", "", function(err,resData,res){
				expect(res.statusCode).toBe(200);
				expect(res.headers).toBeDefined();
				expect(typeof resData).toBe("string");
				var parsed_resData = JSON.parse(resData);
				expect(typeof parsed_resData).toBe("object");

				expect(parsed_resData.error).toBe(null);
				expect(typeof parsed_resData.data).toBe("object");
				expect(parsed_resData.data._id).toBe(id);
				done();
			});
		});


		it("should return error if can't find by ID", function(done){

			requestHelper.request(server.hostname, server.port, "/findbyid?id="+"000000", "GET", "", function(err,resData,res){
				expect(res.statusCode).not.toBe(200);
				expect(res.headers).toBeDefined();
				expect(typeof resData).toBe("string");
				var parsed_resData = JSON.parse(resData);
				expect(typeof parsed_resData).toBe("object");
				done();
			});
		});


		it("should return error if can't find by ID (ID not defined)", function(done){

			requestHelper.request(server.hostname, server.port, "/findbyid", "GET", "", function(err,resData,res){
				expect(res.statusCode).not.toBe(200);
				expect(res.headers).toBeDefined();
				expect(typeof resData).toBe("string");
				var parsed_resData = JSON.parse(resData);
				expect(typeof parsed_resData).toBe("object");
				done();
			});
		});


		it("should delete by ID", function(done){
			requestHelper.request(server.hostname, server.port, "/deletebyid?id="+id, "DELETE", {}, function(err,resData,res){
				expect(res.statusCode).toBe(200);
				expect(res.headers).toBeDefined();
				expect(typeof resData).toBe("string");
				var parsed_resData = JSON.parse(resData);
				expect(typeof parsed_resData).toBe("object");

				expect(parsed_resData.error).toBe(null);
				expect(parsed_resData.data).toBe("Note deleted");
				done();
			});
		});


		it("should return error if can't delete by ID (uing same ID we just deleted above)", function(done){
			requestHelper.request(server.hostname, server.port, "/deletebyid?id="+id, "DELETE", {}, function(err,resData,res){
				expect(res.statusCode).not.toBe(200);
				expect(res.headers).toBeDefined();
				expect(typeof resData).toBe("string");
				var parsed_resData = JSON.parse(resData);
				expect(typeof parsed_resData).toBe("object");
				done();
			});
		});

	});
  
});