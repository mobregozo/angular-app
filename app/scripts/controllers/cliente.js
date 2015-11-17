'use strict';

/**
 * @ngdoc function
 * @name gestionDeAutosApp.controller:ClienteController
 * @description
 * # ClienteController
 * Controller of the gestionDeAutosApp
 */
angular.module('gestionDeAutosApp')
  .controller('ClienteController', function ($scope,$location,$modal,$http,$log,clientService) {
  $scope.createNewUser=false;
  $scope.clientList=[];
  $scope.animationsEnabled = true;

  //Get client Listing
  $scope.getClientListing = function() {
   var promise = clientService.getClients();
   promise.then(
      function(payload) { 
          $scope.clientList = payload.data;
      },
      function(errorPayload) {
          $log.error('failure loading clients', errorPayload);
      });
  };

  $scope.getClientListing();

  //switch to screen to add a new client
  $scope.addClient  = function(){
  	$scope.createNewUser=true;
  };

  //Go back to the listing screen
  $scope.backToList = function(){
    $scope.createNewUser=false;
    $scope.reset();
  };

  //Save Client
	$scope.saveClient = function(client) {
    var promise = clientService.createClient(client);
    promise.then(
      function(payload) { 
          $scope.clientList.push(payload.data);
          $scope.reset();
          $scope.backToList();
      },
      function(errorPayload) {
          //error
      });
  };

  $scope.removeClient = function(client){
    var promise = clientService.deleteClient(client.id);
    promise.then(
      function(payload) { 
        removeClient(client.id,$scope.clientList);
      },
      function(errorPayload) {
          //error
      });
  };

  //function to reset the form
	$scope.reset = function() {
    $scope.user = {address: "", address_dpto: "", address_number: "" , birth_day: "" , email: "" , name: "", nick: "", nro_documento: "", payment_day: "" , phone: "", position: "", surname: "" , zone: ""};
		
	};  	

  //Modal Interaction
  $scope.openLoanModel = function (size,client) {
    var modalInstanceLoan = $modal.open({
        animation: true,
        templateUrl: 'loan-modal.html',
        controller: 'ModalLoanCtrl',
        size: size,
        resolve: {
        client: function () {
          return client;
        }
      }
    });
  }

  function removeClient(clientId,list){
    for (var c in list){
      if (list[c].id==clientId){
        list.splice(c, 1);
      }
    }
  }
  //Modal Interaction
	$scope.open = function (size,client) {
  	var modalInstance = $modal.open({
  			animation: true,
  			templateUrl: 'myModalContent.html',
  			controller: 'ModalInstanceCtrl',
  			size: size,
  			resolve: {
  			client: function () {
  			  return client;
  			}
  		}
	})
	//New Client Modal Promise
	modalInstance.result.then(function (savedClient) {			  
    var promise = clientService.updateClient(savedClient);
    promise.then(
         function(payload) {
         //sin error
      },
      function(errorPayload) {
          //error
      });
      }, function () {

               });
      };
  })

//Modal Controller
.controller('ModalInstanceCtrl', function ($scope, $modalInstance, client) {
	$scope.savedClient=client;
	$scope.userF = angular.copy(client);

  $scope.ok = function () {
    angular.copy($scope.userF,$scope.savedClient);
    $modalInstance.close($scope.userF);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})

//Modal Loan Controller
.controller('ModalLoanCtrl', function ($scope, $modalInstance, client, loanService) {
  $scope.client=client;
  $scope.clientLoans=[];

    //Get client Listing
  $scope.getClientListing = function() {
   var promise = loanService.getLoansbyUser(client);
   promise.then(
      function(payload) { 
          $scope.clientLoans = payload.data;
      },
      function(errorPayload) {
          $log.error('failure loading clients', errorPayload);
      });
  };

});
