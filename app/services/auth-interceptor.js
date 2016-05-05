angular.module("arkano_angular")
    .factory("AuthInterceptor",[
        "$q",
        "$state",
        "AuthService",
        function($q,$state,AuthService){
            var service = {};
            
            service.request = function(config){
                config.headers = config.headers || {};
                var token = AuthService.getAccessToken();  
                if(token){
                    config.headers.Authorization = "token "+token;
                }
                return config;
            };
            
            service.responseError = function(rejection){
                //si el token esta expirado
                //significa que no esta autorizado para acceder al recurso
                if(rejection.status===401){
                    $state.go("Authorize");
                }  
                return $q.reject(rejection);
            };
            
            return service;
        }
    ]);