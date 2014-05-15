var app = angular.module("app", ["ngRoute"]);
var glob;




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
					$('#addNoteModal').modal("toggle");
				});

			}
		});
		// console.log($scope.temp);
	}
	
})




app.controller("NavBarController", function($scope, $location){
	$scope.getClass = function(path){
		if ($location.path() == path) return true;
		else return false;
	}	
})




app.config(function($routeProvider){
	$routeProvider
		.when("/", {
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
		console.log(idata);
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

})


 app.directive("datetimepickerelem", function(){
 	return {
 		restrict : "A",
 		require: "ngModel",
 		link: function(scope, element, attrs, ngModelCtrl){
 			$("#datetimepicker1").on("dp.change", function(e){
 				ngModelCtrl.$setViewValue(element.find("input").val());
 				console.log(ngModelCtrl);
 				//scope.$apply();
 			})


 		}
 	}

 })