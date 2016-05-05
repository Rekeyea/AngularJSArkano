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