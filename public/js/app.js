var easyNoteApp = angular.module("easyNoteApp", ["ngRoute"]);
//.config(easyNoteRoutes);

easyNoteApp.controller("navbarController", function($scope, $location){
	$scope.activate = function(path){
		if (path===$location.path()) return true;
		else return false;
	}
});


easyNoteApp.controller("notesController", function($scope, easyNoteService){
	
	$("button").leanModal();
	
	$scope.addNote = function(){
		
	}

	easyNoteService.getAllNotes(function(data){
		for (var i = 0; i < data.data.length; i++) {
			data.data[i].expire = easyNoteService.fixDate(data.data[i].expire);
		};
		$scope.notes = data.data;
	});


});



