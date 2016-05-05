var express = require('express');
var bodyParser = require("body-parser");
var request = require('request');
var app = express();

app.set('port', (process.env.PORT || 5000));
var options = {
    root: __dirname + '/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
};
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());

app.post("/api/token",function(req,res){
    var obj = req.body;
    request({
        url:"https://github.com/login/oauth/access_token",
        method:"POST",
        body:obj,
        json:true        
    },function(error,response,body){
        res.send(body);
    });
});

app.listen(app.get("port"), function () {
    console.log("Listening ...");
});