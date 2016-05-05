angular.module("arkano_angular")
    .factory("AuthService",[
        "localStorageService",
        function(localStorageService){
            var token_key = "arkano.access.token";
            var last_state_key = "arkano.last.state";
            var authService = {};
            
            authService.getState = function(){
                var currentState = (Math.random()*(99999999)).toFixed(0).toString();
                localStorageService.set(last_state_key,currentState);
                return currentState;    
            };
            authService.validateState = function(state){
                return localStorageService.get(last_state_key) === state;
            };
            authService.saveAccessToken = function(token) {
                localStorageService.set(token_key,token);
            };
            authService.getAccessToken = function(){
                return localStorageService.get(token_key);
            };
            authService.userIsLogged = function(){
                return localStorageService.get(token_key)||false;
            };
            authService.clearAccessToken = function(){
                localStorageService.remove(token_key);
            };
            
            return authService;
        }
    ]);