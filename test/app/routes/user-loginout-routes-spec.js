
//npm run test-routesa
console.log("-------------------------------- TEST ------------------------------------")
var requestHelper = require("../../helpers/requestHelper.js");
var server = {
	hostname:"localhost",
	port:5000
}

var randomNr = Math.random()*100000000000000000;
var user = {
	username: "TestUser" + randomNr.toString(),
	password: "password123"
}
var cookie = "";

describe("User Auth Routes", function(){ 
	

	//describe("SIGNIN:", function(){
		it("should create a new user", function(done){
			console.log("USERNAME: " + user.username);
			requestHelper.request(server.hostname, server.port, "/signin", "POST", cookie, user,  function(err, resData, res){
				if (err) console.log(err);

				console.log("---------- SIGNIN RES STATUS : " + res.statusCode);
				expect(res.statusCode).toBe(200);
				process.nextTick(function(){                   //to avoid redirect
					console.log("---------- SIGNIN RES STATUS nexttick : " + res.statusCode);
					done();
				})
				
			})
		})



	//describe("LOGIN", function(){
		it("should login", function(done) {
		  requestHelper.request(server.hostname, server.port, "/login", "POST", cookie, user,  function(err, resData, res){
				if (err) console.log(err);
				console.log("---------- LOGIN RES STATUS : " + res.statusCode);
				expect(res.statusCode).toBe(302);
				process.nextTick(function(){                   //to avoid redirect
					console.log("---------- LOGIN RES STATUS nexttick : " + res.statusCode);
					cookie=res.headers['set-cookie'];
					done();
				})
			})
		});




		it("should check if session is open and user is still logged in", function(done) {
		  requestHelper.request(server.hostname, server.port, "/checklogin", "GET", cookie, "",  function(err, resData, res){
				if (err) console.log(err);
				console.log("---------- CHECKLOGIN RES STATUS : " + res.statusCode);
				expect(res.statusCode).toBe(200);
				process.nextTick(function(){                   //to avoid redirect
					console.log("---------- CHECKLOGIN RES STATUS nexttick : " + res.statusCode);
					done();
				})
			})
		});




		it("should delete user", function(done) {
		  requestHelper.request(server.hostname, server.port, "/deleteuser", "GET", cookie, "",  function(err, resData, res){
				if (err) console.log(err);
				console.log("---------- DELETE RES STATUS : " + res.statusCode);
				expect(res.statusCode).toBe(200);
				process.nextTick(function(){                   //to avoid redirect
					console.log("---------- DELETE RES STATUS nexttick : " + res.statusCode);
					done();
				})
			})
		});




});