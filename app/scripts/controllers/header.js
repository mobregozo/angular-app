'use strict';

/**
 * @ngdoc function
 * @name gestionDeAutosApp.controller:navBarCtrl
 * @description
 * # navBarCtrl
 * Controller of the gestionDeAutosApp
 */
angular.module('gestionDeAutosApp')
.controller('navBarCtrl',['$scope', '$rootScope', '$route' , '$location', 'AuthenticationService', 
	function ($scope,$route,$rootScope,$location,AuthenticationService) {

    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };

    $scope.showExit = function(){
    	return !('/login'=== $location.path());
    }

	$scope.logout = function(){
    	$location.path('/login');
    }

}]);
