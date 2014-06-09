
easyNoteApp.config(function($routeProvider){


	$routeProvider
		.when("/", 
				{
					templateUrl:"views/homeView.html"
				}
		)
		.when("/details",
				{
					templateUrl:"views/detailsView.html"
				}
		)
});
