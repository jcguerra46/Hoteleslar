
var app = angular.module("app", ["ngRoute", "ngResource"])

.config(['$routeProvider', function ($routeProvider)
{
	$routeProvider.when('/home', {
		templateUrl: 'templates/list.html',
		controller: 'HomeCtrl'
	})
	.when('/edit/:id', {
		templateUrl: 'templates/edit.html',
		controller: 'EditCtrl'
	})
	.when('/create', {
		templateUrl: 'templates/create.html',
		controller: 'CreateCtrl'
	})
	.otherwise({ redirectTo: '/home'});
}])

.controller('HomeCtrl', ['$scope', 'Hoteles', '$route', function ($scope, Hoteles, $route) {
	Hoteles.get(function(data)
	{
		$scope.hoteles = data.hoteles;
	})

	$scope.remove = function(id)
	{
		Hoteles.delete({id:id}).$promise.then(function(data)
		{
			if (data.msg) {
				$route.reload();
			}
		})
	}
}])

.controller('EditCtrl', ['$scope', 'Hoteles', '$routeParams', function ($scope, Hoteles, $routeParams) {
	$scope.settings = {
		pageTitle: "Editar Hotel",
		action: "Editar"
	}

	var id = $routeParams.id;
	Hoteles.get({id:id}, function(data)
	{
		$scope.hotel = data.hotel;
	})

	$scope.submit = function()
	{
		Hoteles.update({id:$scope.hotel.id}, $scope.hotel).$promise.then(function(data)
		{
			if (data.msg) {
				$scope.settings.success = "Hotel editado satisfactoriamente!"
			};
		})
	}
}])

.controller('CreateCtrl', ['$scope', 'Hoteles', function ($scope, Hoteles) 
{
	$scope.settings = {
		pageTitle: "Crear Hotel",
		action: "Crear"
	}

	$scope.hotel = {
		name: "",
		starts: "",
		price: ""
	};

	$scope.submit = function()
	{
		Hoteles.save($scope.hotel).$promise.then(function(data)
		{
			if (data.msg) {
				angular.copy({}, $scope.hotel);
				$scope.settings.success = "Hotel guardado exitosamente!";
			}
		});
	}

}])

.factory('Hoteles', function ($resource) {
	return $resource("http://localhost/hoteles/public/hoteles/:id", {id:"@_id"}, {
		update: {method: "PUT", params: {id: "@id"}}
	})
})