var http = require('http');
var pahtRegexp = require('./pathRegexp');
var url  = require('url');
module.exports = App;

function App(){
    var self = this;
    var middleList = this._middleList = [];
    this._route_gethandle =[];
    this._route_posthandle =[];
    this._server = http.createServer(function(req,res){
        req.params  ={};
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
                var path = url.parse(req.url).pathname;
                function findHandle(route_handles){
                    for(var i = 0,len = route_handles.length;i<len;i++){
                        var route_handle = route_handles[i];
                        var pass = route_handle.route.test(path);
                        if(pass){
                            route_handle.route.paramNames.forEach(function (name,index) {
                                req.params[name] = RegExp["$"+(index+1)];// question  $1
                            })
                            handle = route_handle.handle;
                            break;
                        }
                    }
                }
                switch (req.method){
                    case "GET":
                        findHandle(self._route_gethandle);
                        break;
                    case "POST":
                        findHandle(self._route_posthandle);
                        break;
                }
                if(handle)
                    handle(req,res);
                else{
                    res.statusCode = 404;
                    res.end();
                }
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
    this._route_gethandle.push({route:pahtRegexp(route),handle:handle});
}

App.prototype.post = function(route,handle){
    this._route_posthandle.push({route:pahtRegexp(route),handle:handle});
}