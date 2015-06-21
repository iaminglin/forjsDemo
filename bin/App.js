var http = require('http');
module.exports = App;

function App(){
    var self = this;
    var middleList = this._middleList = [];
    this._route_gethandle = {};
    this._route_posthandle = {};
    this._server = http.createServer(function(req,res){

        var middleIndex =0;
        execMiddle();


        function next(){
            middleIndex+=1;
            execMiddle();
        }


        function execMiddle(){
            var middle = middleList[middleIndex];
            if(middle)
                middle(req,res,next);
            else{
                var handle;
                switch (req.method){
                    case "GET":
                        handle = this._route_gethandle[req.url];
                        break;
                    case "POST":
                        handle = this._route_posthandle[req.url];
                        break;
                }
                if(handle)
                    handle(req,res);
            }
        }
    });
}
App.prototype.use = function(middle){
    this._middleList.push(middle);
}
App.prototype.listen = function(){
    this._server.listen.apply(this._server,arguments);
}

App.prototype.get = function (route,handle) {
    this._route_gethandle[route] = handle;
}

App.prototype.post = function(route,handle){
    this._route_posthandle[route] = handle;
}