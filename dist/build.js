angular.module("arkano_angular",[
    "pascalprecht.translate",
    "tmh.dynamicLocale",
    "ui.router",
    "LocalStorageModule",
    "ngRoute"
]);
angular.module("arkano_angular")
    .config([
        "$locationProvider",
        "$stateProvider",
        "$urlRouterProvider",
        function($locationProvider,$stateProvider,$urlRouterProvider){
            $locationProvider.hashPrefix("!").html5Mode(true);
            $stateProvider
                .state("Home",{
                    url:"/",
                    templateUrl:"app/src/home/home.tpl.html",
                    controller:"homeCtrl",
                    controllerAs:"home"
                })
                .state("Authorize",{
                    url:"/authorize",
                    templateUrl:"app/src/authorize/authorize.tpl.html",
                    controller:"authorizeCtrl",
                    controllerAs:"authorize"
                });
        }
    ])
    .run([
        function(){
            
        }
    ]);
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
angular.module("arkano_angular")
    .controller("authorizeCtrl",[
        "$location",
        "$state",
        "$http",
        "AuthService",
        function($location,$state,$http,AuthService){
            var authorize = this;
                        
            authorize.init = function(){
                var params = $location.search();
                authorize.code = params.code;
                authorize.state = params.state;
                authorize.error = "";
            
                var code = authorize.code;
                var state = authorize.state;
                if (AuthService.validateState(state)){
                    //"https://github.com/login/oauth/access_token"
                    $http.post("http://127.0.0.1:5000/api/token",{
                        client_id:"b9b71a562e2371672974",
                        client_secret:"7773f59a6ef6357214390d513094075bf6dce1c6",
                        code: code,
                        state:state
                    },{
                        headers:{
                            Accept: "application/json"
                        }    
                    }).then(function(res){
                        var data = res.data;
                        if(data.error){
                            authorize.error = data.error_description;
                        }else{
                            AuthService.saveAccessToken(data["access_token"]);
                            $state.go("Home");   
                        }
                    },function(err){
                        authorize.error = JSON.stringify(err);    
                    });
                }else{
                    authorize.error = "Error de Inicio de Sesión en Github";
                }
            };
        }
    ]);
angular.module("arkano_angular")
    .controller("homeCtrl",[
        "$window",
        "$http",
        "AuthService",
        function($window,$http,AuthService){
            var home = this;
            home.Title = "Arkano Angular: Github";
            home.Repos = [];
            home.userIsLogged = false;
            
            home.init = function(){
                home.Repos = [];
                home.userIsLogged=AuthService.userIsLogged();
                if(home.userIsLogged){
                    //tarea: Interceptor
                    $http.get("https://api.github.com/user/repos?access_token="+AuthService.getAccessToken())
                        .then(function(data){
                            home.Repos = data.data;
                        });
                }
            };
            home.startLogInProcess = function(){
                $window.location.href="https://github.com/login/oauth/authorize?client_id=b9b71a562e2371672974&scope=repo&state="+AuthService.getState();
            };
            home.close = function(){
                AuthService.clearAccessToken();
                home.init();
            };
        }
    ]);