var jwt = require("jwt-simple");
var bcrypt = require("bcrypt-nodejs");
var User = require("./../models/users.js");


module.exports=function(app){
	app.post("/login", function(req,res,next){
	if (!(req.body.username && req.body.password)) res.send(400,"Wrong login fields");
	else {
		User.findOne({'username' : req.body.username}, function(err, user){
			if (!user) res.send(404, "User not found in db");
			else {
				if (bcrypt.compareSync(req.body.password, user.password)) {
					req.session.token = user.token;
					res.cookie('token', user.token);
					res.redirect("/checklogin");
				}
				else res.send(403, 'Bad Password');
			}
		})
	}
})


app.post("/signin", function(req,res,next){
	//validate
	if (!((req.body.username)&&(req.body.password))) {
		res.send(400, "WRONG SIGNIN FIELDS");
	}
	else {
		User.findOne({'username':req.body.username}, function(err, foundUser){
			if (foundUser) res.send(400, "User already exists");
			else {
				var token = jwt.encode(req.body.username, "secretToken");
				var pass = bcrypt.hashSync(req.body.password);
			
				var userDbField = new User({
					'username':req.body.username,
					'password': pass,
					'token': token
				});
				console.log(userDbField);
				User.create(userDbField, function(err){
								if (err) res.send(500, "Error creating user in DB");
								else res.send(200, "User created");
							})
			}
		})
	}
})


app.get("/deleteuser", isLoggedIn, function(req,res){
	var user = jwt.decode(req.cookies.token, "secretToken");
	User.findOneAndRemove({'username':user}, function(err, user){
		if (err) res.send(400,"DB Error deleting user");
		else if (!user) res.send (404, "DB Error finding user");
		else res.send(200, "User deleted");
	})
})




app.get("/logout", isLoggedIn, function(req,res){
		res.clearCookie('token');
		req.session.token = null;
		res.send(200, "LOGGED OUT");
})


	app.get("/checklogin", isLoggedIn, function(req,res,next){
		res.send(200, "VALID");
	})


function isLoggedIn(req,res,next){
	// console.log(req.session.token);
	// console.log(req.cookies.token);
	if (req.session.token && req.session.token === req.cookies.token) {
		next();
	}
	else res.redirect('/login');
}


}