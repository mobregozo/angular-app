'use strict';

/**
 * @ngdoc function
 * @name gestionDeAutosApp.controller:PrestamosController
 * @description
 * # PrestamosController
 * Controller of the gestionDeAutosApp
 */
angular.module('gestionDeAutosApp')
  .controller('PrestamosCtrl', function ($scope,$location,$modal,$http,$log,clientService,loanService,paymentService) {
  $scope.clientList=[];
  $scope.loans=[];
  $scope.animationsEnabled = true;
  $scope.selectedclient=null;
  $scope.prestamo={};
  $scope.createLoan=false;
  $scope.isCollapsed = false;
  $scope.error='';
  $scope.days=[];
  $scope.prestamo = {name:null,payment_day:null, method_payment_day: 'mensual',borrowed_car:null, client: null, description: null ,payment:null, number_fees: null, amount_fee: null};
  for (var i = 1; i < 32; i++) { $scope.days[i] = i; };

  //Get client Listing
  $scope.getClientListing = function() {
    var promise = clientService.getClients();
    promise.then(
      function(payload) { 
          $scope.clientList = payload.data;
      },
      function(errorPayload) {
          $log.error('failure loading clients', errorPayload);
      }
    );
  };
  
  $scope.getPaymentListing = function(loan) {
    var promise = paymentService.getgetPaymentsLoad(loan);
    promise.then(
      function(payload) { 
          return  payload.data;
      },
      function(errorPayload) {
          $log.error('failure loading payments', errorPayload);
      }
    );
  };

  $scope.openLoan= function(loan){
    if(!loan.isCollapsed){
      loan.isCollapsed=true;
      loan.payments = $scope.getPaymentsLoad();
    }
    else
      loan.isCollapsed=false;
  }

  //Get Loan Listing
  $scope.getLoanListing = function() {
   var promise = loanService.getLoans(0,10);
   promise.then(
      function(payload) { 
          $scope.loans = payload.data;
      },
      function(errorPayload) {
          $log.error('failure loading clients', errorPayload);
      });
  };
  
  $scope.getLoanListing();

  $scope.addLoan = function(){
    //get clients
    $scope.getClientListing();
    $scope.createLoan=true;
  }

  $scope.backToList = function(){
    $scope.createLoan=false;
  }

  $scope.selectClient = function(client){
    $scope.prestamo.client=client;
  }

  $scope.saveLoan = function(prestamo){

    if (!prestamo.client){
      $scope.error='Debe Seleccionar un Cliente';
    }else{
      var promise = clientService.createLoan(prestamo);
      promise.then(
        function(payload) { 
            $scope.clientList.push(payload.data);
            $scope.reset();
            $scope.backToList();
        },
        function(errorPayload) {
          var jsonObj = JSON.parse(errorPayload.data);
          $scope.error=jsonObj[Message];
      });
    }
  }

  //function to reset the form
  $scope.reset = function() {
    $scope.selectedclient=null;
    $scope.prestamo = {name:null,payment_day:null, method_payment_day: 'semanal',borrowed_car:null, client: null, description: null ,payment:null, number_fees: null, amount_fee: null};
  	
  };  	


});
