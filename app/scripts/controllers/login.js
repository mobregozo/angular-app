'use strict';

/**
 * @ngdoc function
 * @name gestionDeAutosApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the gestionDeAutosApp
 */
angular.module('gestionDeAutosApp')
.controller('LoginController',['$scope', '$rootScope', '$location', 'AuthenticationService', '$timeout', '$http',
function ($scope, $rootScope, $location, AuthenticationService, $timeout, $http) {
    
    // reset login status
    AuthenticationService.ClearCredentials();

    $scope.login = function () {
        $scope.dataLoading = true;
        AuthenticationService.Login($scope.username, $scope.password, function(response) {
            if(response.message != '' && response.code > 199 && response.code < 205) {
                AuthenticationService.SetCredentials($scope.username, $scope.password);
                $location.path('/');
                
            } else {
                $scope.error = 'Nombre de Usuario o Clave Incorrectos';
                $timeout(function(){
                    $scope.error = '';
                }, 4000);
                $scope.dataLoading = false;
                $http.defaults.headers.common['Authorization'] = '';
            }
        });
	};
}]);
