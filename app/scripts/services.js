'use strict';

angular.module('gestionDeAutosApp')
.factory('clientService', function($http) {
  return {
    getClients: function() {
       return $http.get('/api/customers/');
    },
    createClient: function(user){
      return  $http.post('api/customers', user);
    },
    updateClient: function(user){
      return  $http.put('api/customers/'+user.id, user);
    },    
    deleteClient: function(userId){
      return  $http.delete('api/customers/'+userId);
    },
    getPayments:function(){
        return $http.get('api/customers/customersByDayOfWeek?paymentDay=');
    },
    getPaymentDay:function(paymentDay){
        return $http.get('api/customers/customersByDayOfWeek?paymentDay='+paymentDay);
    },
    printPayment:function(day){
        return $http.get('api/customers/printByDayOfWeek?paymentDay='+day.toString(),{responseType: 'arraybuffer'})
    },
    getLoans: function(page,size) {
       return $http.get('/api/loans?page=' + page + '&size=' + size);
    },
    //Retorna todos los préstamos de un customer;
    getLoansByCustomerId: function(customerId) {
       return $http.get('/api/loans/' + customerId);
    },
    //Crea un préstamo para el customer;
    createLoan: function(loan) {
        var customerId = loan.client.id;
       return $http.post('/api/loans/' + customerId, loan);
    },    
    //Retorna el préstamo por el id en el customer y id del loan;
    getLoanById: function(customerId, loanId) {
       return $http.get('/api/loans/' + customerId + "/" + loanId);
    },    
    //Actualiza el préstamo por id en el customer;
    updateLoan: function(loan) {
        var customerId = loan.client.id;
       return $http.put('/api/loans/' + customerId + "/" + loan.id, loan);
    },    
    //Elimina el préstamo por id en el customer;
    deleteLoan: function(loan) {
        var customerId = loan.client.id;
       return $http.delete('/api/loans/' + customerId + "/" + loan.id, loan);
    },    
    //Retorna todo los préstamos por fecha
    getLoansByPaymentDay: function(paymentDay) {
       return $http.get('/api/daily/loans/byDay?paymentDay=' + paymentDay);
    }

  };
})


.factory('paymentService', function($http) {
  return {
    getPaymentById: function(loan) {
       return $http.get('/api/pays/'+loand.id+'/current');
    },
    getPaymentsLoad: function(loan) {
       return $http.get('/api/pays/'+loand.id);
    },
    getPaymentsDay: function() {
       return $http.get('/api/pays/current');
    },
  };
})


.factory('loanService', function($http) {
  return {
    getLoans: function(pageN,pageSize) {
       return $http.get('/api/loans'+'?page='+pageN+'&size='+pageSize);
    },
    getLoansbyUser: function(user) {
       return $http.get('/api/loans/'+user.id);
    },
    createLoan: function(loan,user){
      return  $http.post('api/loans/'+user.id, loan);
    },
    getLoanById: function(loan,user){
      return  $http.get('api/loans/'+user.id+'/'+loan.id);
    },    
    updateLoan: function(loan,user){
      return  $http.put('api/loans/'+user.id+'/'+loan.id,loan);
    },
    deleteLoan:function(loan,user){
        return  $http.delete('api/loans/'+user.id+'/'+loan.id);
    },
    getLoansByDay:function(day){
        return  $http.get('api/daily/loans/byDay?paymentDay='+day);
    },
    printLoansByDay:function(day){
        return  $http.get('api/daily/loans/printbyDay?paymentDay='+day);
    }
  };
})
.factory('AuthenticationService', ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout',
  function (Base64, $http, $cookieStore, $rootScope, $timeout) {
    var service = {};

    service.Login = function (username, password, callback) {

        /* timeout para simular backend
         ----------------------------------------------*/
        $timeout(function(){
            var response = { success: username === 'user1' && password === 'password' };
            if(!response.success) {
                response.message = 'Credenciales Inválidas, Por favor Intntelo de Nuevo' ;
            }
                callback({'code': 200, 'data': "", 'message' : 'Bienvenido' });
        }, 1000);


        /* autenticacion de la API
         ----------------------------------------------*/


        // $http.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        // $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(username + ':' + password);
        

        // $http.post('/api/authenticate')
        // .success(function (data, status, headers, config) {
        //     callback({'code': 200, 'data': "", 'message' : 'Bienvenido' });
        // })
        // .error(function (data, status, headers, config) {
        //     callback({'code': status, 'data': data, 'message' : 'Usuario o password invalido ' });
        // });
    };

    service.SetCredentials = function (username, password) {
        var authdata = Base64.encode(username + ':' + password);

        $rootScope.globals = {
            currentUser: {
                username: username,
                authdata: authdata
            }
        };

        $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
        $cookieStore.put('globals', $rootScope.globals);
    };

    service.ClearCredentials = function () {
        $rootScope.globals = {};
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic ';
    };

    return service;
}])
  
.factory('Base64', function () {
    /* jshint ignore:start */
  
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
  
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
  
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
  
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
  
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
  
            return output;
        },
  
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
  
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
  
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
  
                output = output + String.fromCharCode(chr1);
  
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
  
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
  
            } while (i < input.length);
  
            return output;
        }
    };
  
    /* jshint ignore:end */
});


