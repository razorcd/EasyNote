var mongoose=require("mongoose");

var userSchema = mongoose.Schema({
	username: String,
	password: String,
	token: String
});

/*
userSchema.methods.generateHash = function(password){
	return password;  //encrypt
}

userSchema.methods.validPassword = function(password){
	return this.password === password;
}
*/
module.exports = mongoose.model("User", userSchema);