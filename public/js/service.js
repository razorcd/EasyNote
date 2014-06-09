
easyNoteApp.service("easyNoteService", function($http, $q){

	this.fixDate = function(date){
		var fixedDate = {};
		eDate = new Date(date);
		fixedDate.date=eDate.toDateString();
		fixedDate.time=eDate.toTimeString().split(" ")[0].substr(0,5);
		return fixedDate;
	}


	this.getAllNotes = function(cb){
		$http({method:"GET", url:"/getallnotes"})
			.success(function(data,status,headers,config){
				cb(data);
			})
			.error(function(data,status,headers,config){
				//deferred.resolve(data);
				cb();
			})
	}
	
})


