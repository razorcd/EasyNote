var app = angular.module("app", ["ngRoute"]);


var mainCtrl = app.controller("MainCtrl", function($scope, $rootScope, $element,dbService){

	dbService.initDateTimePicker();
	$scope.notes = {};

	dbService.getAllNotes(function(data){
		$scope.notes = data;
	});


	$scope.submitAddNoteForm = function() { 
		// console.log($element);
		// $scope.temp = document.getElementById("xxxx").value;
		dbService.submitAddNoteForm($scope.inputtitle, $scope.inputtext , $scope.inputdatetime, function(err){
			if(err.error) console.error(err);
			else {
				console.log(err.data);
				dbService.getAllNotes(function(data){
					$scope.notes = data;
					$(".modal-body form")[0].reset()
					$('#addNoteModal').modal("toggle");
				});

			}
		});
		// console.log($scope.temp);
	}


	$scope.deleteNote = function(id){
		dbService.deleteById(id, function(err){
			if(false) console.error(err);
			else {
				//console.log(err.data);
				dbService.getAllNotes(function(data){
					$scope.notes = data;
				});

			}
		})
	}



	$scope.updateNote = function(note){
		//console.log(note.title);
		dbService.updateById(note._id, note.title, note.text, note.expire, function(err){
			if(err.error) console.error(err);
			else {
				console.log(err.data);
				dbService.getAllNotes(function(data){
					$scope.notes = data;
				});

			}
		})
	
	}

})




app.controller("NavBarController", function($scope, $location){
	console.log($location.path());
	$scope.getClass = function(path){
		if ($location.path() == path) return true;
		else return false;
	}	
})




app.config(function($routeProvider){
	$routeProvider
		.when(null, {
					templateUrl: "views/home.html"
					}
		)
		.when("/about", {
						 templateUrl: "views/about.html"
						}
		)

		
});




app.service("dbService", function($http){

	this.getAllNotes = function(cb){
		$http({method: "GET", url:"/getallnotes"})
			.success(function(data,status,headers,config){
				//console.info(data);
				if (data.error) {
					cb(null) ;
				}
				cb(data.data);
			})
			.error(function(data,status,headers,config){
				cb(null);
			})
	}

	this.initDateTimePicker = function(){
		$('#datetimepicker1').datetimepicker();
		console.log("Date-time picker initialised ");
	}

	this.submitAddNoteForm = function(inputtitle, inputtext , inputdatetime, cb){
		var idata = {
			title : inputtitle,
			text : inputtext,
			expire : inputdatetime
		}
		//console.log(idata);
		$http.post("/addnote", idata)
		 	.success(function(data,status,headers,config){
				if (data.error) {
					cb(null) ;
				}
				cb(data);
			})
			.error(function(data,status,headers,config){
				cb(null);
			})
	}


	this.updateById = function(id, newTitle, newText, newExpire, cb){
		var newdata = {
			id : id,
			title : newTitle,
			text : newText,
			expire : newExpire
		}
		$http.post("/updatebyid", newdata)
		 	.success(function(data,status,headers,config){
				if (data.error) {
					cb(null) ;
				}
				cb(data);
			})
			.error(function(data,status,headers,config){
				cb(null);
			})
	}



	this.deleteById = function(id, cb){
		$http.delete("/deletebyid?id=" + id)
			.success(function(data,status,headers,config){
				if (data.error) {
					cb(null) ;
				}
				cb(data);
			})
			.error(function(data,status,headers,config){
				cb(null);
			})

	}

})






 app.directive("datetimepickerelem", function(){
 	return {
 		restrict : "A",
 		require: "ngModel",
 		link: function(scope, element, attrs, ngModelCtrl){
 			$("#datetimepicker1").on("dp.change", function(e){
 				ngModelCtrl.$setViewValue(element.find("input").val());
 				//console.log(ngModelCtrl);
 				//scope.$apply();
 			})


 		}
 	}

 })



 app.directive("updateable", function(){
 	return {
 		restrict: "A",
 		require: "ngModel",
 		link: function(scope, element, attrs, ngModelCtrl){

 			element.on("blur", function(e){
 				//console.log(element.text());
 			 	ngModelCtrl.$setViewValue(element.text());
 			 	//console.log(scope.note);
 			 	scope.$apply();
 			 	scope.updateNote(scope.note);

 			})
 		}

 	}
 })