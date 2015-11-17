'use strict';

/**
 * @ngdoc function
 * @name gestionDeAutosApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gestionDeAutosApp
 */
angular.module('gestionDeAutosApp')
  .controller('MainCtrl', [ '$scope' , '$log' , 'loanService', '$sce', function ($scope,$log,loanService, $sce) {
    $scope.filteredTodos = [];
    $scope.content = null; 
    $scope.date = new Date();
    $scope.payments = [];
    $scope.currentPage = 1;
    $scope.numPerPage = 5;
    $scope.maxSize = 4;
    $scope.printError='';
    $scope.print={day:null};
    $scope.payments =[];

    //Get payments of the day
    $scope.printPayments = function(date) {
        $scope.printError="";
        if ($scope.print.day){
            var promise = loanService.printPayment(date);
            promise.then(
            function(payload) { 
                //Print File
                   var file = new Blob([(payload.data)], {type: 'application/pdf'});
                   var fileURL = URL.createObjectURL(file);
                   $scope.content = $sce.trustAsResourceUrl(fileURL);
                   window.open(fileURL);

            },
            function(errorPayload) {
                $scope.printError="Ha Ocurrido Un Error Intente Nuevamente";
                $log.error('failure loading file', errorPayload);
            });
        }
        else{
            $scope.printError="La Fecha Ingresada Es Invalida";
        }
    };

    //Get payments of the day
    $scope.getPayments = function() {
        var date = new Date();
        var promise = loanService.getLoansByDay(getToday());
        promise.then(
        function(payload) { 
            $scope.payments = payload.data;
        },
        function(errorPayload) {
            $log.error('failure loading payments', errorPayload);
        });
    };

    $scope.getPayments();

    function getToday (){
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        } 

        if(mm<10) {
            mm='0'+mm
        } 

        today = yyyy+'-'+mm+'-'+dd;

        return today;
    }




  }]);
