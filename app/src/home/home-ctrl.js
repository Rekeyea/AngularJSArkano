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